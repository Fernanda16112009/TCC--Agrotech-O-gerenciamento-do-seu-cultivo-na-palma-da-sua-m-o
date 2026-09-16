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
                        <p>${p.post}</p><br>
                        <form action="/redeSocial/comentarios/${p.idPostagem}" method="get">
                            <button type="submit">Comentarios</button>
                        </form>


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
                        <p>${p.post}</p><br>
                        <img src="${p.imagem}" class="imagemPost" alt="Não foi possível carregar essa imagem">

                        <form action="/redeSocial/comentarios/${p.idPostagem}" method="get">
                            <button type="submit">Comentarios</button>
                        </form>
                        
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
                        <form action="/" method="get">
                            <button class="btn_pg_inicial">Voltar</button><br><br>
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

async function mostrarComentarios(req,res){

    const idPostagem = req.params.idPostagem

    redeSocialModel.pegarComentarios( idPostagem, async(erro, comentarios) =>{
        
        if (erro) {
            console.log(erro);
            return res.send('Erro ao buscar comentarios');
        }

        const co  = await Promise.all (comentarios.map( async c =>{ 
            
            if(c.imagem === null){
                const idUsuario = c.idUsuario;

                const data = new Date(c.dataComentario);

                const dataFormatada = data.toLocaleDateString('pt-BR');

                const nome = await redeSocialModel.pegarNomeUsuarioPorID(idUsuario);
                
                return`
                    <div class="postagem">
                        <p><b>${nome[0].nome_usuario}</b></p>
                        <p>${dataFormatada}</p><br>
                        <p>${c.comentario}</p><br>

                    </div>
                `
            }else{
                const idUsuario = c.idUsuario;

                const data = new Date(c.dataComentario);

                const dataFormatada = data.toLocaleDateString('pt-BR');

                const nome = await redeSocialModel.pegarNomeUsuarioPorID(idUsuario);
                
                return`
                    <div class="postagem">
                        <p><b>${nome[0].nome_usuario}</b></p>
                        <p>${dataFormatada}</p><br>
                        <p>${c.comentario}</p><br>
                        <img src="${c.imagem}" class="imagemPost" alt="Não foi possível carregar essa imagem">
                        
                    </div>
                    
                `
            }
        }))

        const comentario = co.join("<br>");

        const html = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Comentarios</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <header>
                    <h1 class="titulo">AgroTech</h1>
                    <h2 class="subtitulo">Comentarios</h2>
                </header>
                <main>
                    <div>
                    <form action="/redeSocial/criarComentario/${idPostagem}" method="post" enctype="multipart/form-data">
                        <textarea name="comentario" id="comentario" class="comentario" rows="20"  placeholder="Escreva um comentario"></textarea>
                        <input type="file" name="imagem" class="imagem"><br><br>
                        <button type="submit">Enviar</button>
                    </form><br>
                    <form action="/redeSocial/redeSocial" method="get">
                        <button class="btn_pg_inicial">Voltar</button><br><br>
                    </form>   
                    </div>
                    <br><br><br>

                    <div>
                        ${comentario}
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

 async function comentar(req,res){

    req.body.idUsuario = req.session.usuario.idUsuario;
    req.body.idPostagem = req.params.idPostagem;

    if(req.file){

        const resultado = await cloudinary.uploader.upload(req.file.path);

        const imagem = resultado.secure_url;

        req.body.imagem = imagem

        await fs.unlink(req.file.path);

        redeSocialModel.comentar(req.body, (erro,) => {
        if (erro) {
            console.log(erro)
            return res.send('Erro ao cadastrar comentario.')
        }

        res.redirect(`/redeSocial/comentarios/${req.body.idPostagem}`);
    })
    }else{
        redeSocialModel.comentar(req.body, (erro,) => {
            if (erro) {
                console.log(erro)
                return res.send('Erro ao cadastrar comentario.')
            }

            res.redirect(`/redeSocial/comentarios/${req.body.idPostagem}`);
        })
    }
}

module.exports = {
    criarPost,
    mostrarPosts,
    mostrarComentarios,
    comentar
}