import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  availableVehicles: Vehicle[];
  soldVehicles: Vehicle[];

  // Add vehicle form
  newReg: string = '';
  newMake: string = '';
  newModel: string = '';
  newColour: string = '';
  newPrice: number = null;

  // Edit vehicle
  vehicleToEdit: Vehicle;
  editState: boolean = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    // Call service to get user's available vehicle stock from FB
    this.vehicleService.getAvailableUserVehicles().subscribe((data) => {
      // Add to array
      this.availableVehicles = data;
    });

    // Call service to get user's sold vehicle stock from FB
    this.vehicleService.getSoldUserVehicles().subscribe((data) => {
      // Add to array
      this.soldVehicles = data;
    });
  }

  markUnsold(vehicle: Vehicle) {
    // Call function on service - pass in vehicle info, change status to unsold & remove sale date
    this.vehicleService.updateVehicle({
      ...vehicle,
      status: 'unsold',
      saleDate: null,
    });
  }

  markSold(vehicle: Vehicle) {
    // Generate new date of sale
    const saleDate = Date.now();
    // Call function on service - pass in vehicle info, change status to sold & add sale date
    this.vehicleService.updateVehicle({
      ...vehicle,
      status: 'sold',
      saleDate: saleDate,
    });
    // Clear edit state
    this.editState = false;
    this.vehicleToEdit = null;
  }

  addVehicle() {
    // Create new vehicle object based on form data
    const newVehicle: Vehicle = {
      registration: this.newReg,
      make: this.newMake,
      model: this.newModel,
      colour: this.newColour,
      price: this.newPrice,
      saleDate: null,
      status: 'unsold',
    };

    // Call function on service - pass in new vehicle
    this.vehicleService.addVehicle(newVehicle);

    // Clear add form state
    this.clearFormState();
  }

  // When edit button clicked
  onEditVehicle(vehicle: Vehicle) {
    this.editState = true;
    this.vehicleToEdit = vehicle;
  }

  // When edit form submitted
  updateVehicle(vehicle: Vehicle) {
    this.vehicleService.updateVehicle(vehicle);
    this.editState = false;
    this.vehicleToEdit = null;
  }

  // When edit form is cancelled
  cancelEdit() {
    this.editState = false;
    this.vehicleToEdit = null;

    // As edit form is bound to HTML, user could edit a field and cancel, but page still shows the unsaved vehicle details.
    // Subscribe again (but only once via take 1) to vehicle service to re-obtain correct vehicle info to overwrite any unsaved changes
    this.vehicleService
      .getAvailableUserVehicles()
      .pipe(take(1))
      .subscribe((data) => {
        // Add to array
        this.availableVehicles = data;
      });

    this.vehicleService
      .getSoldUserVehicles()
      .pipe(take(1))
      .subscribe((data) => {
        // Add to array
        this.soldVehicles = data;
      });
  }

  clearFormState() {
    this.newReg = '';
    this.newMake = '';
    this.newModel = '';
    this.newColour = '';
    this.newPrice = null;
  }
}
