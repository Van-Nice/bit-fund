;; mock-sbtc.clar
;; A mock sBTC token contract for testing on Stacks devnet

;; Define the fungible token 'sbtc' with no initial supply limit
(define-fungible-token sbtc)

;; Store the deployer as the owner (for minting permissions)
(define-data-var owner principal tx-sender)

;; Transfer function: Move sBTC from sender to recipient
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    ;; Ensure the caller is the sender (from must be tx-sender)
    (asserts! (is-eq from tx-sender) (err u1)) ;; Error u1: Unauthorized
    ;; Check sender has sufficient balance
    (asserts! (>= (ft-get-balance sbtc from) amount) (err u2)) ;; Error u2: Insufficient balance
    ;; Perform the transfer
    (try! (ft-transfer? sbtc amount from to))
    (ok true)
  )
)

;; Mint function: Allow the owner to mint sBTC (for testing)
(define-public (mint (amount uint) (recipient principal))
  (begin
    ;; Restrict minting to the owner (deployer)
    (asserts! (is-eq tx-sender (var-get owner)) (err u3)) ;; Error u3: Not owner
    ;; Mint the specified amount to the recipient
    (try! (ft-mint? sbtc amount recipient))
    (ok true)
  )
)

;; Get balance function: Query an address's sBTC balance
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance sbtc account))
)