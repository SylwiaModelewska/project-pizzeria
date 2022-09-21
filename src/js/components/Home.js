import { templates } from '../settings.js';

class Home{

  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();

  }

  render(element){
    const thisHome = this;

    const generateHTML = templates.homePage(element);
    thisHome.dom = {};
    thisHome.wrapper = element;
    thisHome.wrapper.innerHTML = generateHTML;
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
}

export default Home;