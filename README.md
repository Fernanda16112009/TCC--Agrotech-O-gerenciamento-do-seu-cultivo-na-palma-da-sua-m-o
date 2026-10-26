# AgroTech

**O gerenciamento do seu cultivo na palma da sua mão.**

Aplicação web para quem está começando a cultivar uma horta: o usuário cadastra a planta, recebe o passo a passo do plantio e acompanha a safra em um calendário com o dia da colheita e o aviso de rega.

Trabalho de Conclusão de Curso do Curso Técnico em Desenvolvimento de Sistemas Integrado ao Ensino Médio — Colégio Estadual João Manoel Mondrone, Medianeira-PR, 2026.

**Autores:** Fernanda Raquel Bertotti, Letícia Menegon Gonçalves e José Augusto Santana Bogler.

---

## Funcionalidades

- Cadastro, login e logout de usuários; edição de nome e e-mail pelo perfil.
- Recuperação de senha por e-mail, com link temporário (veja [Recuperação de senha](#recuperação-de-senha)).
- Cadastro de plantas (morango, cenoura, pepino e tomate, em 10 tipos) com quantidade de sementes, data do plantio, uso de agrotóxico e localização pelo aparelho. A safra é numerada automaticamente.
- Passo a passo do cultivo de cada tipo de planta.
- Minhas plantas: renomear a safra, enviar foto, atualizar a localização, escrever anotações e excluir.
- Calendário com o dia do plantio e o dia previsto da colheita, e aviso de rega com base na previsão de chuva (Open-Meteo).
- Área de pragas (10 pragas) e página de compostagem e adubação.
- Painel administrativo: listar, buscar, editar e excluir usuários.
- Acessibilidade em Libras com o VLibras.

## Tecnologias

HTML, CSS e JavaScript no front-end; Node.js com Express 5 no back-end; MySQL ou MariaDB (biblioteca `mysql2`); `express-session`, `bcryptjs` e `jsonwebtoken` para sessão, senhas e links de recuperação; Resend (e-mail); Cloudinary com `multer` (fotos); Open-Meteo (previsão de chuva).

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (já inclui o npm).
- MySQL 8 ou MariaDB.
- Conta gratuita no [Resend](https://resend.com/) — só para a recuperação de senha.
- Conta gratuita no [Cloudinary](https://cloudinary.com/) — só para o envio de fotos das safras.

O sistema roda sem Resend e sem Cloudinary, mas a recuperação de senha e o envio de fotos não funcionam sem eles.

## Como executar

1. **Baixe o projeto** e abra a pasta dele no terminal.

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o banco de dados.** O arquivo `Banco/banco.sql` cria o banco `agrotech`, as tabelas e os dados iniciais (catálogo de plantas e contas de teste):

   ```bash
   mysql -u root -p < Banco/banco.sql
   ```

   > Atenção: o script apaga e recria as tabelas `usuarios`, `plantaadm` e `plantausuario`. Se já existirem dados no banco `agrotech`, eles serão perdidos.

4. **Crie o arquivo `.env`** na raiz do projeto (mesma pasta do `package.json`), seguindo o exemplo da próxima seção.

5. **Inicie o servidor:**

   ```bash
   npm start
   ```

   Para reiniciar automaticamente a cada alteração nos arquivos (usa o nodemon), rode `npm run dev`.

6. **Acesse** <http://localhost:8000> (ou a porta definida em `PORT`).

## Configuração do `.env`

Crie o arquivo `.env` com o conteúdo abaixo e troque os valores. **Nunca envie o `.env` para o Git nem para outras pessoas**: ele guarda senhas e chaves.

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=agrotech

# Servidor
PORT=8000
BASE_URL=http://localhost:8000

# Segredos (use textos longos e aleatórios, diferentes entre si)
SESSION_SECRET=troque_por_um_texto_longo_e_aleatorio
JWT=troque_por_outro_texto_longo_e_aleatorio

# Recuperação de senha (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

# Fotos das safras (Cloudinary)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

| Variável | Obrigatória? | Para que serve |
|---|---|---|
| `DB_USER`, `DB_NAME` | Sim | Usuário e nome do banco. O servidor não inicia sem elas. |
| `DB_PASSWORD` | Se o usuário do banco tiver senha | Senha do usuário do banco. |
| `DB_HOST`, `DB_PORT` | Não | Padrões: `localhost` e `3306`. |
| `SESSION_SECRET` | Sim | Protege as sessões de login. O servidor não inicia sem ela. |
| `JWT` | Sim | Base para assinar os links de recuperação de senha. O servidor não inicia sem ela. |
| `PORT` | Não | Porta do servidor. Padrão: `8000`. |
| `BASE_URL` | Recomendada | Endereço usado no link do e-mail de recuperação de senha. Padrão: `http://localhost:8000`. |
| `RESEND_API_KEY` | Só para recuperar senha | Chave da API do Resend. |
| `CLOUDINARY_URL` | Só para fotos | Credenciais do Cloudinary, no formato `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. |

Para gerar um segredo aleatório, rode no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Contas de teste

O `banco.sql` cria duas contas:

| Papel | E-mail | Senha |
|---|---|---|
| Usuário comum | `usuario@gmail.com` | `123456` |
| Administrador | `admin@gmail.com` | `123456` |

O administrador é levado ao painel administrativo (`/adm`) depois do login.

Também é possível criar uma conta pela tela de cadastro e transformá-la em administradora direto no banco:

```sql
UPDATE usuarios SET role = 'adm' WHERE email = 'seu@email.com';
```

Troque as senhas das contas de teste antes de publicar o sistema em algum servidor.

## Recuperação de senha

### Como funciona

1. Na tela de login, o usuário clica em recuperar senha e informa o e-mail.
2. Se o e-mail estiver cadastrado, o sistema envia uma mensagem com um link para trocar a senha. O link vale por **1 hora** e deixa de valer assim que a senha é trocada.
3. O usuário abre o link, digita a nova senha duas vezes e volta para a página inicial.

Por segurança, a mensagem exibida na tela é a mesma esteja o e-mail cadastrado ou não.

### O que é necessário para funcionar

1. **Chave do Resend (`RESEND_API_KEY`).** Crie uma conta gratuita em <https://resend.com/>, gere uma API Key e coloque no `.env`. Sem ela, o servidor inicia com um aviso no terminal e a tela de recuperação mostra a mensagem normal, mas **nenhum e-mail é enviado**.

2. **`JWT` e `BASE_URL` no `.env`.** O `JWT` assina o link, e a `BASE_URL` forma o endereço que vai dentro do e-mail (`BASE_URL/trocarSenha/trocarSenha?id=...&token=...`). Se você mudar a `PORT`, mude também a `BASE_URL` (por exemplo, `http://localhost:3000`). Com `localhost`, o link só abre no computador em que o servidor está rodando.

3. **Limitação do remetente de teste.** O sistema envia os e-mails como `Agrotech <onboarding@resend.dev>`, o remetente de teste do Resend. Nesse modo, o Resend entrega mensagens **apenas para o e-mail com o qual a conta do Resend foi criada**. Na prática, a recuperação de senha só funciona para usuários cadastrados com esse e-mail.

   Para enviar para qualquer usuário, seria preciso verificar um domínio próprio no Resend e trocar o remetente (`from`) na função `enviarEmail`, em `Controllers/usuarioController.js`. Isso não foi feito nesta versão.

### Como testar ou demonstrar

1. Crie a conta no Resend e coloque a `RESEND_API_KEY` no `.env`.
2. Cadastre um usuário no AgroTech usando **o mesmo e-mail da conta do Resend**.
3. Na tela de login, use a opção de recuperar senha e informe esse e-mail.
4. Abra o e-mail recebido (veja também a caixa de spam) no computador em que o servidor está rodando e clique no link.
5. Digite a nova senha e faça o login.

### Se não funcionar

| Problema | O que verificar |
|---|---|
| O e-mail não chega | O e-mail do usuário é o mesmo da conta do Resend? A `RESEND_API_KEY` está correta? Olhe a caixa de spam e o terminal do servidor, onde os erros de envio aparecem. |
| O link abre a página inicial em vez da troca de senha | O link expirou (mais de 1 hora) ou a senha já foi trocada. Peça um novo link. |
| O link não abre | A `BASE_URL` está diferente do endereço e da porta em que o servidor roda? |
| A mensagem de envio aparece, mas nada é enviado | A `RESEND_API_KEY` não está definida no `.env`. O terminal mostra o aviso na inicialização. |

## Estrutura do projeto

```text
Banco/             script SQL (banco.sql)
Config/            conexão com o banco (pool MySQL)
Constantes/        listas de plantas e pragas, e validações dos dados
Controllers/       regras de cada funcionalidade
Model/             consultas ao banco de dados
routes/            rotas da aplicação
middlewares.js     verificação de login e de administrador
privado/           páginas que exigem login
public/            páginas e arquivos públicos
recursosPrivados/  CSS, JavaScript e imagens das áreas privadas
trocarSenha/       página de troca de senha
uploads/           pasta temporária do envio de fotos
servidor.js        arquivo de entrada
```

## Segurança

- O `.env` está no `.gitignore` e não deve ser versionado. Se uma chave vazar (por exemplo, por ter ido para o GitHub), gere uma nova no painel do serviço correspondente.
- As senhas são guardadas com hash (bcrypt) e as consultas ao banco usam parâmetros.