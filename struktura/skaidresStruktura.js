class skaidresStruktura {
    constructor(folder, data) {
        this.folder = folder;
        this.data = data;
    }

    isValidFolder() {
        return typeof this.folder === 'string' && this.folder !=='';
    }

    isValidData() {
        if (typeof this.data !== 'object' 
        || this.data === null
        || Array.isArray(this.data)
        || typeof this.data.src !== 'string'
        || this.data.src === ''
        || typeof this.data.alt !== 'string'
        || this.data.alt === '') {
            return false;
        }
        return true;
    }

    render () {
        return `<div class ="paveikslas">
                    <img src="${this.folder + this.data.src}" alt="${this.data.alt}" class="img">
                    <h2>"${this.data.title}"</h2>
                    <p>${this.data.years}</br>${this.data.format}</br>Aliejiniai dažai ant drobės.</p>
                    
                </div>`;
    }
}

export { skaidresStruktura }