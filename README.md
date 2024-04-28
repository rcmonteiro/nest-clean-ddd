

```sh
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in private_key.pem -out public_key.pem

openssl base64 -A -in private_key.pem -out private_key_base64.txt

openssl base64 -A -in public_key.pem -out public_key_base64.txt
```