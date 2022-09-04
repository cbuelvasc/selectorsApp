import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { CountriesService } from '../../services/selector-page.service';
import { CountryV3, CountryV2 } from '../../interfaces/countries.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  regions: string[] = [];
  countries: CountryV3[] = [];
  borders: (CountryV2 | null)[] = [];
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.regions = this.countriesService.regiones;

    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('country')?.reset('');
          this.loading = true;
        }),
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.countries = countries;
        this.loading = false;
      });

    this.myForm
      .get('country')
      ?.valueChanges.pipe(
        tap(() => {
          this.borders = [];
          this.myForm.get('border')?.reset('');
        }),
        switchMap((code) => this.countriesService.getCountryByCode(code)),
        switchMap((country) =>
          this.countriesService.getCountryByCodes(country?.borders!)
        )
      )
      .subscribe((countries) => {
        this.borders = countries;
        this.loading = false;
      });
  }

  save() {}
}
