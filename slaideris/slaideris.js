class Slaideris {
    constructor(selector, cardClass, data, settings) {
        this.selector = selector;
        this.cardClass = cardClass;
        this.data = data;
        this.settings = settings;
        this.slaiderioDOM = null;

        this.size = {
            mobile: 1,
            tablet: 1,
            desktop: 1,
        }
        this.previousNext = true;
        this.dots = true;

        this.currentlyVisibleIndex = 0;
        this.originalListSize = this.data.list.length;
        this.listSize = 0;
        this.copyCount = 0;
        this.animationInAction = false;
        this.animationDurationInMiliseconds = 2000;

        this.init();
    }

    init() {
        if (!this.isValidSelector) {
            return [true, 'neteisingas selektorius']
        }

        if (!this.isValidData) {
            return [true, 'neteisingi duomenys']
        }

        if (!this.findTargetElement()) {
            return [true, 'Pagal pateikta selektoriu nepavyko rasti norimo elemento']
        }

        this.updateDefaultSettings();

        this.render();
        this.action();
    }

    isValidSelector() {
        if(typeof this.selector !== 'string'
        || this. selector === '') {
            return false; 
        }
        return true;
        // return typeof this.selector === 'string' && this.selector !== '';
    }

    isValidData() {
        if (!this.isObject(this.data)
        || !Array.isArray(this.data.list)
        || this.originalListSize === 0) {
            return false;
        }
        return true;
    }

    findTargetElement() {
        this.slaiderioDOM = document.querySelector(this.selector);
        // return this.slaiderioDOM ? true : false;     --- tas pats
        return !!this.slaiderioDOM;
    }

    isObject(obj) {
        if (typeof this.settings !== 'object'
            || this.settings === null
            || Array.isArray(this.settings)) {
            return false;
        }
        return true;
    }

    updateDefaultSettings() {
        if (!this.isObject(this.settings)) {
            return false;
        }

        if (this.isObject(this.settings.size)) {
            if (Number.isInteger(this.settings.size.mobile)
            && this.settings.size.mobile > 0) {
                this.size.mobile = this.settings.size.mobile; 
            }
            if (Number.isInteger(this.settings.size.tablet)
            && this.settings.size.tablet > 0) {
                this.size.tablet = this.settings.size.tablet; 
            }
            if (Number.isInteger(this.settings.size.desktop)
            && this.settings.size.desktop > 0) {
                this.size.desktop = this.settings.size.desktop; 
            }
        }

        if (typeof this.settings.previousNext === 'boolean') {
            this.previousNext = this.settings.previousNext;
        }

        if (typeof this.settings.dots === 'boolean') {
            this.dots = this.settings.dots;
        }
    }

    listHTML() {
        let HTML = '';
        // let copyCount = 0;

        for (const key in this.size) {
            // console.log(key, this.size[key]);
            if (this.copyCount < this.size[key]) {
                this.copyCount = this.size[key];
            }
        }

        this.originalListSize = this.data.list.length;

        const list = [
            ...this.data.list.slice(-this.copyCount),
            ...this.data.list,
            ...this.data.list.slice(0, this.copyCount),
        ];

        // console.log(this);        

        for (const item of list) {
            const card = new this.cardClass(this.data.srcFolder, item);
            // console.log(card);
            if (card.isValidData() && card.isValidFolder()) {
            HTML += `<div class="skaidre">${card.render()}</div>`;    
            }
        }

        this.listSize = list.length;
        this.currentlyVisibleIndex = this.size.desktop;
        const width = this.listSize / this.size.desktop * 100;
        const trans = 100 / this.listSize * this.currentlyVisibleIndex;


        return `<div class="langas">
                    <div class="sarasas-liniuote" 
                         style="transform: translateX(-${trans}%);  
                                width: ${width}%;">
                        ${HTML}
                    </div>
                </div>`
    }

    actionsHTML() {
        if (!this.previousNext && !this.dots) {
            return '';
        }

        let leftAngleHTML = '';
        let rightAngleHTML = '';
        let dotsHTML = '';

        if (this.previousNext) {
            leftAngleHTML = `<div class="rodykle kaire">
                                    <div class="kairen"></div>  
                                </div>`;
            rightAngleHTML = `<div class="rodykle desine">
                                    <div class="desinen"></div>  
                                </div>`;
        }

        if (this.dots) {
            dotsHTML = `<div class="burbulai">
                            <div class="burbuliukas aktyvus"></div>
                            ${'<div class="burbuliukas"></div>'.repeat(this.originalListSize - 1)}
                        </div>`;
        }

        return `<div class="navigacija">
                    ${leftAngleHTML}
                    ${dotsHTML}
                    ${rightAngleHTML}
                </div>`;
    }

    render() {
        // this.slaiderioDOM.innerHTML = this.listHTML() + this.actionsHTML();
        const HTML = this.listHTML() + this.actionsHTML();
        this.slaiderioDOM.innerHTML = HTML;
    }

    action() {
        // console.log(this.slaiderioDOM);
        const listDOM = this.slaiderioDOM.querySelector('.sarasas-liniuote');
        const nextDOM = this.slaiderioDOM.querySelector('.desine');
        const previousDOM = this.slaiderioDOM.querySelector('.kaire');
        // console.log(nextDOM);
        // console.log(previousNext);

        nextDOM.addEventListener('click', () => {
            console.log('rodyk sekanti..');
            if (!this.animationInAction) {
                 this.currentlyVisibleIndex++;    
                const trans = -100 / this.listSize * this.currentlyVisibleIndex;
                // console.log(this.currentlyVisibleIndex, trans + '%');
                // console.log(listDOM);
                listDOM.style.transform = `translateX(${trans}%)`;

                // teleportas i prieki

                if (this.currentlyVisibleIndex === this.originalListSize + this.copyCount) {
                    setTimeout(() => {
                        listDOM.style.transition = 'all 0s';
                        this.currentlyVisibleIndex = this.copyCount;
                        const trans = -100 / this.listSize * this.currentlyVisibleIndex;
                        listDOM.style.transform = `translateX(${trans}%)`;
                        setTimeout(() => {
                            listDOM.style.transition = 'all 2s';
                        }, 16)
                    }, this.animationDurationInMiliseconds)
                }

                this.animationInAction = true;

                setTimeout(() => {
                    this.animationInAction = false;
                }, this.animationDurationInMiliseconds)
            }
        });

        previousDOM.addEventListener('click', () => {
            console.log('rodyk pries tai buvusi...');
            if (!this.animationInAction) {
                this.currentlyVisibleIndex--;    
                const trans = -100 / this.listSize * this.currentlyVisibleIndex;
                listDOM.style.transform = `translateX(${trans}%)`;

                // teleportas i gala

                if (this.currentlyVisibleIndex === 0) {
                    setTimeout(() => {
                        listDOM.style.transition = 'all 0s';
                        this.currentlyVisibleIndex = this.listSize - 2 * this.copyCount;
                        const trans = -100 / this.listSize * this.currentlyVisibleIndex;
                        listDOM.style.transform = `translateX(${trans}%)`;
                        setTimeout(() => {
                            listDOM.style.transition = 'all 1s';
                        }, 16)
                    }, this.animationDurationInMiliseconds)
                }
            }
            
            this.animationInAction = true;
    
            setTimeout(() => {
                this.animationInAction = false;
            }, this.animationDurationInMiliseconds)
        });
    }
}

export { Slaideris }