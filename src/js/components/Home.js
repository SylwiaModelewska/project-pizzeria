import { select, templates, classNames } from '../settings.js';

class Home{

  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
    thisHome.initLinks();
  
  }

  render(element){
    const thisHome = this;

    const generateHTML = templates.homePage(element);
    thisHome.dom = {};
    thisHome.wrapper = element;
    thisHome.wrapper.innerHTML = generateHTML;
    thisHome.dom.homeLinks = thisHome.wrapper.querySelectorAll(select.containerOf.homeLinks);
  }

  initWidgets(){
    var elem = document.querySelector('.main-carousel');
    var flkty = new Flickity( elem, { // eslint-disable-line
      // options
      cellAlign: 'left',
      contain: true,
      autoPlay: 3000,
      prevNextButtons: false,
    });
  }


  activatePage(pageId){

    const pages = document.querySelector(select.containerOf.pages).children;
    const navLinks = document.querySelectorAll(select.nav.links);

    window.location.hash = '#/' + pageId;

    for(let page of pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for(let link of navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

  }

  initLinks(){
    const thisHome = this;

    for(let link of thisHome.dom.homeLinks){
      link.addEventListener('click', function(event){
        event.preventDefault();
        let idPage = link.getAttribute('href').replace('#', '');

        thisHome.activatePage(idPage);
      });
    }
  }
}

export default Home;