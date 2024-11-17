import { Observable } from '@nativescript/core';
import { languages } from '../data/languages';
import { lessons } from '../data/lessons';

export class MainViewModel extends Observable {
    private _selectedIndex: number = 0;
    private _selectedLanguage: string | null = null;

    constructor() {
        super();
        
        this.set('languages', languages);
        this.set('lessons', lessons);
        this.set('user', {
            name: "Language Explorer",
            level: 5,
            xp: 1250,
            streak: 7,
            learningLanguage: 'es',
            completedLessons: ['basics-1']
        });
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.notifyPropertyChange('selectedIndex', value);
        }
    }

    onLanguageSelect(args) {
        const language = args.object.bindingContext;
        this._selectedLanguage = language.code;
        this.selectedIndex = 1; // Switch to lessons tab
    }
}