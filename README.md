# 📸 Jonatan Castro Fotografia

Site do estúdio **Jonatan Castro Fotografia**, em Breves – PA.
HTML, CSS e JavaScript puro, sem framework e sem etapa de build.

## O que o site tem

- Topo em tela cheia com as fotos do estúdio trocando sozinhas.
- Sobre o estúdio, com os diferenciais.
- **Portfólio** com filtro (Ensaios, Família & kids, Eventos) e visualizador em tela cheia: setas, teclado e deslizar o dedo no celular.
- **Serviços** com preços. O botão "Quero este ensaio" já escolhe o serviço no formulário.
- Cobertura de eventos, "Como funciona" e perguntas frequentes.
- **Contato**: o formulário abre o WhatsApp com a mensagem pronta. Também tem e-mail, endereço com mapa e redes sociais.
- Botão flutuante do WhatsApp.
- Pronto para o Google e para compartilhar no WhatsApp e no Instagram: descrição, imagem de prévia e dados do estúdio (endereço e telefone).

## Fotos

As fotos ficam em `imagens/fotos/`, cada uma em três tamanhos (640, 1200 e 2000 px de largura, em `.webp`). O navegador baixa só o tamanho que a tela precisa, então o site abre rápido até em celular com 4G.

Para trocar ou adicionar uma foto:
1. Gere os três tamanhos com o mesmo nome base, por exemplo `nova-foto-640.webp`, `nova-foto-1200.webp` e `nova-foto-2000.webp`. Dá para usar o [Squoosh](https://squoosh.app).
2. Copie um bloco `<figure class="gallery__item">` no `index.html` e troque o nome dos arquivos, o texto alternativo (`alt`) e a categoria (`data-cat`).

## Publicar no Vercel

1. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe este repositório.
2. Em *Framework Preset*, escolha **Other**. Não precisa de comando de build.
3. Clique em **Deploy**. Cada commit na `main` publica sozinho.

O `vercel.json` já configura o cache das imagens e alguns cabeçalhos de segurança.

Quando tiver o endereço final (por exemplo `jonatancastro.com.br` ou `xxx.vercel.app`), vale colocá-lo no `index.html`, nas tags `og:image`, `og:url` e `canonical`, com o endereço completo. Isso garante a prévia com foto quando o link é compartilhado no WhatsApp.

## Estrutura

```
index.html          página
style/style.css     visual
script/script.js    interações (menu, slideshow, galeria, formulário)
imagens/fotos/      fotos do portfólio (3 tamanhos cada)
imagens/marca/      logo, ícones e imagem de compartilhamento
vercel.json         configuração do Vercel
```

## Licença

Projeto desenvolvido sob encomenda para uso exclusivo do cliente.
