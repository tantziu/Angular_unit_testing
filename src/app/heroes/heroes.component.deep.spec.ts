import { HeroesComponent } from "./heroes.component";
import {of} from 'rxjs';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { HeroService } from "../hero.service";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector: '[routerLink]',
    host: {'(click)': 'onClick()'},
})
export class RouterLinkDirectivStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let heroes;
    let mockHeroService;

    let fixture: ComponentFixture<HeroesComponent>;

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
                HeroComponent,
                RouterLinkDirectivStub
            ],
            providers: [
                {provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
        mockHeroService.getHeroes.and.returnValue(of(heroes));

        
    });

    describe('HeroesComponent (deep tests)', () => {
        it('should render each hero component as a HeroComponent', () => {
            mockHeroService.getHeroes.and.returnValue(of(heroes))
            
            //run ngOnInit
            fixture.detectChanges();

            let heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
            expect(heroComponentDEs.length).toEqual(3);

            for(let i=0; i < heroComponentDEs.length; i++) {
                expect(heroComponentDEs[i].componentInstance.hero).toEqual(heroes[i]);
            }   
        });

        //interraction between child and parent component
        it(`should call heroService.deleteHero when the HeroComponent's
            delete button is clicked`, () => {
                spyOn(fixture.componentInstance, 'delete');
                mockHeroService.getHeroes.and.returnValue(of(heroes))
            
                fixture.detectChanges();
                
                const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
                console.log(heroComponents)
                // heroComponents[0].query(By.css('button'))
                //     .triggerEventHandler('click', {stopPropagation: () => {}})

                //another option
                // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

                //raising event on child
                heroComponents[0].triggerEventHandler('delete', null);

                expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[0]);
        });

        it('should add a new hero to the hero list when the add button is clicked', () => {
            mockHeroService.getHeroes.and.returnValue(of(heroes))
            fixture.detectChanges();
            const name = "Mr. Ice";
            mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
            const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
            const addButton = fixture.debugElement.queryAll(By.css('button'))[0];


            inputElement.value = name;
            addButton.triggerEventHandler('click', null);
            fixture.detectChanges();

            const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
            expect(heroText).toContain(name);
        });

        it('should have the correct route for the first hero', () => {
            mockHeroService.getHeroes.and.returnValue(of(heroes))

            fixture.detectChanges();
            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

            let routerLink = heroComponents[0]
                .query(By.directive(RouterLinkDirectivStub))
                .injector.get(RouterLinkDirectivStub);

            heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
            expect(routerLink.navigatedTo).toBe('/detail/1');
        })
    })
})