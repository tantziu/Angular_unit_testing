import { HeroesComponent } from "./heroes.component";
import {of} from 'rxjs';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { HeroService } from "../hero.service";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let heroes;
    let mockHeroService;

    let fixture: ComponentFixture<HeroesComponent>;


    @Component({
        selector: 'app-hero',
        template: '<div></div>',
    })
    class FakeHeroComponent {
        @Input() hero: Hero;
        // @Output() delete = new EventEmitter();
    }

    beforeEach(() => {
        heroes = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55},
        ]

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        component = new HeroesComponent(mockHeroService);  
        
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                FakeHeroComponent
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    describe('delete', () => {
        it('should remove the indicated hero from the heroes list', () => {
            mockHeroService.deleteHero.and.returnValue(of(true))
            component.heroes = heroes;
            
            component.delete(heroes[2]);

            expect(component.heroes.length).toBe(2);
        })

        it('should call deleteHero() with the correct value', () => {
            mockHeroService.deleteHero.and.returnValue(of(true))
            component.heroes = heroes;
            // component.ngOnInit();
            
            component.delete(heroes[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroes[2]);
        });
    })

    describe('getHeroes (shallow)', () => {
        it('should set heroes correctly from the service', () => {
            mockHeroService.getHeroes.and.returnValue((of(heroes)));
            fixture.detectChanges();
    
            expect(fixture.componentInstance.heroes.length).toBe(3);
        });
    
        it('should create one li for each hero', () => {
            mockHeroService.getHeroes.and.returnValue((of(heroes)));
            fixture.detectChanges();
    
            expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
        })
    });  
})
