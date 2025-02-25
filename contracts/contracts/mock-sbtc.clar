;; mock-sbtc.clar
(define-fungible-token sbtc)
(define-data-var owner principal tx-sender)

(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) (err u1))
    (asserts! (>= (ft-get-balance sbtc from) amount) (err u2))
    (try! (ft-transfer? sbtc amount from to))
    (ok true)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u3))
    (try! (ft-mint? sbtc amount recipient))
    (ok true)
  )
)

(define-public (deposit (btc-amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u3))
    (try! (ft-mint? sbtc btc-amount recipient))
    (ok true)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance sbtc account))
)