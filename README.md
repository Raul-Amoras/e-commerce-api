### Comando para gerar RSA256 no Windows Usando Git Bash ###

openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in private_key.pem -out public_key.pem

### converte hash em base64 usando Windows Usar Git Bash ###

// Obs : base64 -w 0: Converte a entrada em base64, evitando quebras de linha.

base64 -w 0 private_key.pem > private_key-base64.txt

base64 -w 0 public_key.pem > public_key-base64.txt

### comando docker para subir a aplicação
docker-compose up -d