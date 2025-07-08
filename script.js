const themes = [
    {
        id: 'the-holidays-code',
        name: 'The Holidays Code',
        stylesheet: 'code',
        className: {
            light: 'vscode-light',
            dark: 'vscode-dark'
        }
    },
    {
        id: 'vs',
        name: 'Visual Studio',
        stylesheet: 'vs',
        className: {
            light: 'vs-light',
            dark: 'vs-dark'
        }
    },
    {
        id: 'intellij-idea',
        name: 'IntelliJ Idea',
        stylesheet: 'idea',
        className: {
            light: 'intellij-idea',
            dark: false
        }
    },
    {
        id: 'darcula',
        name: 'Darcula',
        stylesheet: 'darcula',
        className: {
            light: false,
            dark: 'darcula'
        }
    }
];

const Mode = {
    Light: 'light',
    Dark: 'dark'
};

class App {
    static THEME_KEY = 'theme';

    static MODE_KEY = 'mode';

    constructor() {
        this.lightRadio = document.getElementById('light');
        this.darkRadio = document.getElementById('dark');
        this.themesSelect = document.getElementById('themes-select');
        this.themeStyleTag = null;

        this.renderThemesSelectOptions();
        this.bindToEvents();

        this.setMode(this.getInititalMode());
        this.setTheme(this.getInititalTheme());
    }

    renderThemesSelectOptions() {
        for (const theme of themes) {
            this.themesSelect.append(Utils.createSelectOption(theme.id, theme.name));
        }
    }

    bindToEvents() {
        this.onModeChange = this.onModeChange.bind(this);
        this.onThemeChange = this.onThemeChange.bind(this);

        this.lightRadio.addEventListener('change', this.onModeChange);
        this.darkRadio.addEventListener('change', this.onModeChange);
        this.themesSelect.addEventListener('change', this.onThemeChange);
    }

    setMode(mode) {
        if (mode === Mode.Light) {
            this.lightRadio.checked = true;
        }

        if (mode === Mode.Dark) {
            this.darkRadio.checked = true;
        }

        this.onModeChange();
    }

    setTheme(theme) {
        this.themesSelect.value = theme.id;

        this.onThemeChange();
    }

    getInititalMode() {
        return this.getCachedMode() ?? Mode.Light;
    }

    getInititalTheme() {
        return this.getCachedTheme() ?? themes.at(0);
    }

    getSelectedMode() {
        if (this.lightRadio.checked) {
            return Mode.Light;
        }

        if (this.darkRadio.checked) {
            return Mode.Dark;
        }

        return null;
    }

    getSelectedTheme() {
        const id = this.themesSelect.value;

        return this.findTheme(id);
    }

    getCachedMode() {
        return localStorage.getItem(App.MODE_KEY) ?? null;
    }

    setCachedMode(mode) {
        localStorage.setItem(App.MODE_KEY, mode);
    }

    getCachedTheme() {
        const id = localStorage.getItem(App.THEME_KEY);

        if (!id) {
            return null;
        }

        return this.findTheme(id);
    }

    setCachedTheme(theme) {
        localStorage.setItem(App.THEME_KEY, theme.id);
    }

    findTheme(id) {
        return themes.find((theme) => theme.id === id) ?? null;
    }

    updateBodyClassName() {
        const selectedMode = this.getSelectedMode();
        const selectedTheme = this.getSelectedTheme();

        document.body.className = [selectedTheme.className[selectedMode], selectedMode].join(' ');
    }

    updateStyleTags() {
        const selectedTheme = this.getSelectedTheme();

        if (this.themeStyleTag) {
            this.themeStyleTag.remove();
        }

        this.themeStyleTag = Utils.createThemeStyleTag(selectedTheme.stylesheet);

        document.head.append(this.themeStyleTag);
    }

    updateModeOptions() {
        const selectedTheme = this.getSelectedTheme();

        this.lightRadio.disabled = !selectedTheme.className.light;
        this.darkRadio.disabled = !selectedTheme.className.dark;
    }

    updateSelectOptions() {
        const selectedMode = this.getSelectedMode();

        for (const option of this.themesSelect.querySelectorAll('option')) {
            const theme = this.findTheme(option.value);

            option.disabled = !theme.className[selectedMode];
        }
    }

    cacheMode() {
        const selectedMode = this.getSelectedMode();

        this.setCachedMode(selectedMode);
    }

    cacheTheme() {
        const selectedTheme = this.getSelectedTheme();

        this.setCachedTheme(selectedTheme);
    }

    onModeChange() {
        this.updateSelectOptions();
        this.updateBodyClassName();
        this.cacheMode();
    }

    onThemeChange() {
        this.updateModeOptions();
        this.updateStyleTags();
        this.updateBodyClassName();
        this.cacheTheme();
    }
}

class Utils {
    static createThemeStyleTag(theme) {
        const link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `./css/${theme}.css`);

        return link;
    }

    static createSelectOption(value, name) {
        const option = document.createElement('option');

        option.value = value;
        option.innerHTML = name;

        return option;
    }
}

new App();
