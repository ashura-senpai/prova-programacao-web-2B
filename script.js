const search_input = document.getElementById("search-noticia")
const total_filtro = document.getElementById("circulo-filtro")
const filtro_tipo = document.getElementById("filtro-tipo")
const filtro_quantidade = document.getElementById("filtro-quantidade")
const filtro_de = document.getElementById("filtro-de")
const filtro_ate = document.getElementById("filtro-ate")

const filtro = document.getElementById("svg-filtro");
const dialog_filtro = document.getElementById("dialog-filtro");
const close_dialog = document.getElementById("close-dialog");

const paginacao = document.getElementById("paginacao");

filtro.addEventListener('click', () => {
  dialog_filtro.showModal();
});

close_dialog.addEventListener('click', () => {
  dialog_filtro.close();
});

const ul_noticia = document.getElementById("conteudo-principal");

trazerInformacoesFiltradas();

function trazerInformacoesFiltradas() {
  setFiltros()
  getQuantidadeFiltros();
  getNoticias().then((noticias) => {
    while (ul_noticia.lastChild) {
      ul_noticia.removeChild(ul_noticia.lastChild);
    }
    createCardsWithNoticias(noticias);
    criarPaginas(noticias.totalPages, noticias.page);
  });
}

async function getNoticias() {
  const dados = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/${window.location.search}`);
  return await dados.json();
}

function createCardsWithNoticias(noticias) {
  noticias.items.forEach(n => adicionarFilho(ul_noticia, createCard(n)));
}

function setFiltros() {
  const url = new URL(window.location);
  search_input.value = url.searchParams.get('busca') ?? '';
  filtro_tipo.value = url.searchParams.get('tipo') ?? '';
  filtro_quantidade.value = url.searchParams.get('qtd') ?? '10';
  filtro_de.value = url.searchParams.get('de') ?? '';
  filtro_ate.value = url.searchParams.get('ate') ?? '';
  url.searchParams.set('qtd', filtro_quantidade.value);
  url.searchParams.set('page', url.searchParams.get('page') ?? '1');
  window.history.pushState({}, '', url);
}

function search(event) {
  event.preventDefault();
  const url = new URL(window.location);
  url.searchParams.set('busca', search_input.value);
  if (search_input.value === '') {
    url.searchParams.delete('busca');
  }
  url.searchParams.set('page', '1');
  window.history.pushState({}, '', url);
  trazerInformacoesFiltradas();
}

function aplicarFiltro(event) {
  event.preventDefault();
  const url = new URL(window.location);
  url.searchParams.set('qtd', filtro_quantidade.value);
  filtro_tipo.value ? url.searchParams.set('tipo', filtro_tipo.value) :
    url.searchParams.delete('tipo');
  filtro_de.value ? url.searchParams.set('de', filtro_de.value) :
    url.searchParams.delete('de');
  filtro_ate.value ? url.searchParams.set('ate', filtro_ate.value) :
    url.searchParams.delete('ate');
  dialog_filtro.close();
  url.searchParams.set('page', '1');
  window.history.pushState({}, '', url);
  trazerInformacoesFiltradas();
}

function getQuantidadeFiltros() {
  const params = new URL(window.location).searchParams;
  let totalFiltros = 0;
  params.forEach((value, key) => {
    if (key !== 'page' && key !== 'busca') {
      totalFiltros++;
    }
  });
  total_filtro.innerText = totalFiltros;
}

function createCard(noticia) {
  const li = criarElementoHTML('li');
  const img = criarElementoHTML('img');
  const divTexto = criarElementoHTML('div');
  const titulo = criarElementoHTML('h2');
  const paragrafo = criarElementoHTML('p');
  const divSepararEditoriasPublicado = criarElementoHTML('div');
  const editorias = criarElementoHTML('p');
  const publicado = criarElementoHTML('p');
  const botaoLerMais = criarElementoHTML('button');

  img.src = getImagem(noticia.imagens);
  img.alt = 'Imagem da notícia';

  titulo.textContent = noticia.titulo;
  paragrafo.textContent = noticia.introducao;
  editorias.textContent = getEditorias(noticia.editorias);
  publicado.textContent = getPublicado(noticia.data_publicacao);

  divTexto.setAttribute('id', 'texto-listagem');

  botaoLerMais.textContent = 'Ler Mais';
  botaoLerMais.addEventListener('click', () => {
    window.open(noticia.link, '_blank');
  });

  adicionarClasses(botaoLerMais, ['width100', 'botao-noticia']);
  adicionarClasses(divSepararEditoriasPublicado, ['flex', 'center-space-between']);
  adicionarClasses(divTexto, ['width100', 'flex-column', 'gap-10']);
  adicionarClasses(img, ['imagem-noticia']);
  adicionarClasses(li, ['card-noticia']);

  adicionarFilho(divSepararEditoriasPublicado, editorias);
  adicionarFilho(divSepararEditoriasPublicado, publicado);

  adicionarFilho(divTexto, titulo);
  adicionarFilho(divTexto, paragrafo);
  adicionarFilho(divTexto, divSepararEditoriasPublicado);
  adicionarFilho(divTexto, botaoLerMais);

  adicionarFilho(li, img);
  adicionarFilho(li, divTexto);

  return li;
}

function getImagem(imagem) {
  return 'https://agenciadenoticias.ibge.gov.br/'
    + JSON.parse(!!imagem ? imagem : '{"image":{"image_intro": ""}}').image_intro;
}

function getEditorias(editorias) {
  return '#' + editorias.replace(';', ' #');
}

function getPublicado(dateString) {
  const date = getFormatDate(dateString);
  const dateHoje = new Date();
  diferencaDatasEmDia = Math.round((dateHoje - date) / 24 / 60 / 60 / 1000);
  if (diferencaDatasEmDia === 0) {
    return 'Publicado hoje';
  }
  if (diferencaDatasEmDia === 1) {
    return 'Publicado ontem';
  }
  return `Publicado há ${diferencaDatasEmDia} dias`;
}

function getFormatDate(dateString) {
  const dateStringArray = dateString.split(' ');
  const onlyDate = dateStringArray[0].split('/');
  const day = onlyDate[0];
  const month = onlyDate[1];
  const year = onlyDate[2];

  return new Date(`${year}-${month}-${day}T${dateStringArray[1]}Z`);
}

function criarElementoHTML(element) {
  return document.createElement(element);
}

function adicionarClasses(element, classes) {
  classes.forEach(c => {
    element.classList.add(c);
  })
}

function adicionarFilho(pai, filho) {
  pai.appendChild(filho);
}

function criarPaginas(totalPage, paginaAtual) {
  let paginas = '';
  let i = 1;
  if (paginaAtual >= 7 && totalPage > 10) {
    i = paginaAtual - 5
  }
  if (paginaAtual >= totalPage - 4 && totalPage > 10) {
    i = totalPage - 9;
  }
  const fimPagina = i + 9
  while (i <= fimPagina && i !== totalPage + 1) {
    paginas += criarPagina(i);
    i++;
  }
  paginacao.innerHTML = paginas;
}

function criarPagina(index) {
  const url = new URL(window.location);
  const isAtiva = url.searchParams.get('page') === index.toString()
  return `
        <li>
            <button 
                class="${isAtiva ? 'pagina-ativa' : 'pagina'} width100" 
                type="button" 
                onclick="changePage(this)">${index}</button>
        </li>
    `
}

function changePage(element) {
  const url = new URL(window.location);
  url.searchParams.set('page', element.textContent);
  window.history.pushState({}, '', url);
  trazerInformacoesFiltradas()
}