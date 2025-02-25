;; Data variable to track the next campaign ID
(define-data-var next-campaign-id uint u0)
(define-data-var unlock-height uint u0)

;; Map to store campaign details, key is campaign-id (uint)
(define-map campaigns uint 
  { 
    creator: principal,         ;; Address of the campaign creator
    goal: uint,                ;; Funding goal in sBTC
    end-block-height: uint,    ;; Block height when campaign ends
    total-funded: uint,        ;; Total sBTC contributed
    funded: bool               ;; Whether funds have been withdrawn
  }
)

;; Map to store contributions, key is a tuple of campaign-id and donor
(define-map contributions 
  { campaign-id: uint, donor: principal } 
  { amount: uint }            ;; Contribution amount in sBTC
)

;; Error codes
(define-constant ERR-CAMPAIGN-NOT-FOUND u1)
(define-constant ERR-CAMPAIGN-ENDED u2)
(define-constant ERR-NOT-CREATOR u3)
(define-constant ERR-CAMPAIGN-NOT-ENDED u4)
(define-constant ERR-GOAL-NOT-MET u5)
(define-constant ERR-ALREADY-FUNDED u6)
(define-constant ERR-NO-CONTRIBUTION u7)
(define-constant ERR-ZERO-CONTRIBUTION u8)

;; Define the sBTC trait
(define-trait sbtc-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
  )
)

;; Function to create a new crowdfunding campaign with event emission
(define-public (create-campaign (goal uint) (duration uint))
  (let ((campaign-id (+ (var-get next-campaign-id) u1)))
    (map-set campaigns campaign-id 
      { 
        creator: tx-sender, 
        goal: goal, 
        end-block-height: (+ stacks-block-height duration), 
        total-funded: u0, 
        funded: false 
      }
    )
    (var-set next-campaign-id campaign-id)
    ;; Emit an event with the campaign details
    (print { 
      event: "campaign-created", 
      campaign-id: campaign-id, 
      creator: tx-sender, 
      goal: goal, 
      end-block-height: (+ stacks-block-height duration) 
    })
    (ok campaign-id)
  )
)

;; Function to contribute sBTC to a campaign (unchanged)
(define-public (contribute (campaign-id uint) (amount uint) (sbtc <sbtc-trait>))
  (let ((campaign (unwrap! (map-get? campaigns campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
    (asserts! (< stacks-block-height (get end-block-height campaign)) (err ERR-CAMPAIGN-ENDED))
    (asserts! (> amount u0) (err ERR-ZERO-CONTRIBUTION))
    (let ((contribution (default-to { amount: u0 } 
                          (map-get? contributions { campaign-id: campaign-id, donor: tx-sender }))))
      (try! (contract-call? sbtc transfer amount tx-sender (as-contract tx-sender) none))
      (map-set contributions 
        { campaign-id: campaign-id, donor: tx-sender } 
        { amount: (+ (get amount contribution) amount) }
      )
      (map-set campaigns campaign-id 
        (merge campaign { total-funded: (+ (get total-funded campaign) amount) })
      )
      (ok true)
    )
  )
)

;; Function for creator to withdraw funds if goal is met (unchanged)
(define-public (withdraw-funds (campaign-id uint) (sbtc <sbtc-trait>))
  (let ((campaign (unwrap! (map-get? campaigns campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
    (asserts! (is-eq tx-sender (get creator campaign)) (err ERR-NOT-CREATOR))
    (asserts! (>= stacks-block-height (get end-block-height campaign)) (err ERR-CAMPAIGN-NOT-ENDED))
    (asserts! (>= (get total-funded campaign) (get goal campaign)) (err ERR-GOAL-NOT-MET))
    (asserts! (not (get funded campaign)) (err ERR-ALREADY-FUNDED))
    (try! (as-contract (contract-call? sbtc transfer 
                        (get total-funded campaign) tx-sender (get creator campaign) none)))
    (map-set campaigns campaign-id (merge campaign { funded: true }))
    (ok true)
  )
)

;; Function for donors to get refunds if goal is not met (unchanged)
(define-public (refund (campaign-id uint) (sbtc <sbtc-trait>))
  (let ((campaign (unwrap! (map-get? campaigns campaign-id) (err ERR-CAMPAIGN-NOT-FOUND))))
    (asserts! (>= stacks-block-height (get end-block-height campaign)) (err ERR-CAMPAIGN-NOT-ENDED))
    (asserts! (< (get total-funded campaign) (get goal campaign)) (err ERR-GOAL-NOT-MET))
    (let ((donor tx-sender))
      (let ((contribution (unwrap! (map-get? contributions 
                                   { campaign-id: campaign-id, donor: donor }) 
                                   (err ERR-NO-CONTRIBUTION))))
        (let ((amount (get amount contribution)))
          (asserts! (> amount u0) (err ERR-ZERO-CONTRIBUTION))
          (try! (as-contract (contract-call? sbtc transfer amount tx-sender donor none)))
          (map-set contributions 
            { campaign-id: campaign-id, donor: donor } 
            { amount: u0 }
          )
          (ok true)
        )
      )
    )
  )
)

;; Read-only function to get campaign details (unchanged)
(define-read-only (get-campaign (campaign-id uint))
  (map-get? campaigns campaign-id)
)

;; Read-only function to get a donor's contribution to a campaign (unchanged)
(define-read-only (get-contribution (campaign-id uint) (donor principal))
  (default-to { amount: u0 } 
    (map-get? contributions { campaign-id: campaign-id, donor: donor }))
)