import { Component, OnInit, ViewChild } from '@angular/core';
import { DetailsService } from '../services/details.service';
import { Dealership } from '../models/Dealership';
import { MappingService } from '../services/mapping.service';
import {
  FlashMessagesModule,
  FlashMessagesService,
} from 'angular2-flash-messages';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  dealershipDetails: Dealership;
  editDetails: boolean = false;
  loading: boolean = false;

  name: string;
  address1: string;
  city: string;
  county: string;
  postcode: string;
  phone: string;
  email: string;

  // Modelled to form for new user
  newName: string;
  newAddress1: string;
  newCity: string;
  newCounty: string;
  newPostcode: string;
  newPhone: string;
  newEmail: string;

  // MAPPING
  lat = 0;
  long = 0;
  zoom = 14;
  address = 'UK';

  // Grab form data from HTML - used when details edited
  @ViewChild('detailsForm') form: any;

  constructor(
    private detailsService: DetailsService,
    private mappingService: MappingService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {
    // this.lat = 0;
    // this.long = 0;
    this.fetchDealershipDetails();
  }

  fetchDealershipDetails() {
    this.loading = true;
    this.detailsService.getDealershipDetails().subscribe((data) => {
      // User can only have one details object so just get first item from array
      this.dealershipDetails = data[0];

      // If user has details saved
      if (this.dealershipDetails) {
        // Set form fields accordingly
        this.name = this.dealershipDetails.name;
        this.address1 = this.dealershipDetails.address1;
        this.city = this.dealershipDetails.city;
        this.county = this.dealershipDetails.county;
        this.postcode = this.dealershipDetails.postcode;
        this.phone = this.dealershipDetails.phone;
        this.email = this.dealershipDetails.email;

        // Call mapping service to get lat/long data - pass in address
        this.mappingService
          .getLatLong(
            `${this.address1}, ${this.city}, ${this.county}, ${this.postcode}`
          )
          .subscribe((data) => {
            // Convert lat/long returned to float & set to vars defined above - then picked up by map
            this.lat = parseFloat(data[0].lat);
            this.long = parseFloat(data[0].lon);
          });

        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  toggleEditDetails() {
    this.editDetails = !this.editDetails;
  }

  onSubmitDetails({ value, valid }) {
    if (valid) {
      // Call update function on service - pass in form data and ID of document (this is originally obtained when dealership details fetched from FB)
      this.detailsService.updateDetails(value, this.dealershipDetails.id);
      this.editDetails = false;
    } else {
      // Show flash message advising to fill in all fields
      this.flashMessage.show('Please fill in all fields.', {
        cssClass: 'alert-danger mt-3 mx-auto',
        timeout: 3000,
      });
    }
  }

  cancelEditDetails() {
    // Reset details to saved dealership data in case user changed fields and then cancelled
    this.name = this.dealershipDetails.name;
    this.address1 = this.dealershipDetails.address1;
    this.city = this.dealershipDetails.city;
    this.county = this.dealershipDetails.county;
    this.postcode = this.dealershipDetails.postcode;
    this.phone = this.dealershipDetails.phone;
    this.email = this.dealershipDetails.email;

    // Set edit to false to hide form
    this.editDetails = false;
  }

  addNewDetails() {
    // Create new details object based on form data
    const newDetails: Dealership = {
      name: this.newName,
      address1: this.newAddress1,
      city: this.newCity,
      county: this.newCounty,
      postcode: this.newPostcode,
      email: this.newEmail,
      phone: this.newPhone,
    };

    // Call function on service - pass in new vehicle
    this.detailsService.addDetails(newDetails);
  }
}
