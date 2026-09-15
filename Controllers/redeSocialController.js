const redeSocialModel = require('../Model/redeSocialModel');
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require('fs/promises');


async function criarPost(req,res){
    
    req.body.idUsuario = req.session.usuario.idUsuario;

    if(req.file){
        const resultado = await cloudinary.uploader.upload(req.file.path);

        const imagem = resultado.secure_url;

        req.body.imagem = imagem

        await fs.unlink(req.file.path);

        redeSocialModel.criarPost(req.body, (erro) =>{
            if (erro) {
                console.log(erro)
                return res.send('Erro ao criar post.')
            }
            res.redirect('/redeSocial/redeSocial')
        })
    }else{
        redeSocialModel.criarPost(req.body, (erro) =>{

            if (erro) {
                console.log(erro)
                return res.send('Erro ao criar post.')
            }
            res.redirect('/redeSocial/redeSocial')
        })
    }


}

async function mostrarPosts(req,res){

    redeSocialModel.pegarPosts(async(erro, posts) =>{
        
        if (erro) {
            console.log(erro);
            return res.send('Erro ao buscar posts');
        }

        const postagem  = await Promise.all (posts.map( async p =>{ 
            
            if(p.imagem === null){
                const idUsuario = p.idUsuario;

                const data = new Date(p.dataPostagem);

                const dataFormatada = data.toLocaleDateString('pt-BR');

                const nome = await redeSocialModel.pegarNomeUsuarioPorID(idUsuario);
                
                return`
                    <div class="postagem">
                        <p><b>${nome[0].nome_usuario}</b></p>
                        <p>${dataFormatada}</p><br>

                        <p>${p.post}</p>
                    </div>
                `
            }else{
                const idUsuario = p.idUsuario;

                const data = new Date(p.dataPostagem);

                const dataFormatada = data.toLocaleDateString('pt-BR');

                const nome = await redeSocialModel.pegarNomeUsuarioPorID(idUsuario);
                
                return`
                    <div class="postagem">
                        <p><b>${nome[0].nome_usuario}</b></p>
                        <p>${dataFormatada}</p><br>

                        <img src="${p.imagem}" class="imagemPost" alt="Não foi possível carregar essa imagem">

                        <p>${p.post}</p>
                    </div>
                    
                `
            }
        }))

        const postagens = postagem.join("<br>");

        const html = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rede social do AgroTech</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <header>
                    <h1 class="titulo">AgroTech</h1>
                    <h2 class="subtitulo">Rede Social</h2>
                </header>
                <main>
                    <div>
                        <form action="/redeSocial/postagem" method="get">
                            <button type="submit">Criar Postagem</button>
                        </form>
                    </div>
                    
                    <br><br><br>

                    <div>
                        ${postagens}
                    </div>
                </main>
                <footer>
                    <div class="footer-conteudo">

                        <h3>AgroTech</h3>

                        <p>
                            O gerenciamento do plantio na palma da sua mão.
                        </p>

                        <p>
                            Sugestões, críticas ou dúvidas?
                            <a href="mailto:agrotech@email.com">Entre em contato conosco</a>
                        </p>

                        <p class="copyright">
                            © 2026 AgroTech. Todos os direitos reservados.
                        </p>

                    </div>

                </footer>

                <p><b></b></p>
            </body>

        `
        res.send(html)
    })
}

module.exports = {
    criarPost,
    mostrarPosts
}