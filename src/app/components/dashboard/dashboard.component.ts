import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  vehicles: Vehicle[];
  popular: any;
  totalSold: number = 0;
  totalUnsold: number = 0;
  avgSoldPrice: number = 0;
  totalUnsoldValue: number = 0;
  makeArray = [];
  // Used by chart
  makeTally = [];

  unsoldLoading: boolean = false;
  soldLoading: boolean = true;

  // Options for chartJS
  chartOptions = {
    maintainAspectRatio: false,
    cutoutPercentage: 50,

    legend: {
      labels: {
        fontSize: 20,
        spacing: 5,
      },
    },
    tooltips: {
      titleFontSize: 20,
      titleSpacing: 2,
      bodyFontSize: 20,
      bodySpacing: 5,
    },
  };

  // Inject vehicle service as dependency
  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.unsoldLoading = true;
    this.soldLoading = true;
    // Call service to get all user's vehicles from FB
    this.vehicleService.getAllUserVehicles().subscribe((data) => {
      // Add to array
      this.vehicles = data;

      var soldCount = 0;
      var unsoldCount = 0;
      // For each vehicle returned, loop through and count tally of status=sold/unsold
      for (var x of this.vehicles) {
        if (x.status == 'sold') {
          // Increase sold count by 1
          soldCount++;
          // Set totalSold (used in HTML) to the sold count
          this.totalSold = soldCount;
        } else {
          unsoldCount++;
          this.totalUnsold = unsoldCount;
        }
      }

      // Ensure make array is empty
      this.makeArray = [];

      // For each unsold vehicle returned, add make to above empty array
      for (x of this.vehicles) {
        if (x.status == 'unsold') {
          this.makeArray.push(x.make);
        }
      }

      // Call tally function below
      this.makeTally = this.getMakeTally();

      this.totalUnsoldValue = this.calcTotalUnsoldValue();
      this.avgSoldPrice = this.calcAvgSalePrice();

      this.soldLoading = false;
      this.unsoldLoading = false;
    });
  }

  // Function for getting number of each make - then used to populate chart
  getMakeTally = () => {
    var a = [],
      b = [],
      prev;

    this.makeArray.sort();
    for (var i = 0; i < this.makeArray.length; i++) {
      if (this.makeArray[i] !== prev) {
        a.push(this.makeArray[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = this.makeArray[i];
    }

    return [a, b];
  };

  // Loop through unsold vehicles and add prices to get total
  calcTotalUnsoldValue = () => {
    var total = 0;
    for (var i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].status == 'unsold') {
        total = total + this.vehicles[i].price;
      }
    }
    return total;
  };

  calcAvgSalePrice = () => {
    var totalSold = 0;

    // Loop through sold vehicles and add prices together
    for (var i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].status == 'sold') {
        totalSold = totalSold + this.vehicles[i].price;
      }
    }

    // Get number of sold vehicles
    const count = this.vehicles.filter((vehicle) => vehicle.status == 'sold')
      .length;

    // If there are sold vehicles, calculate avg price
    if (count > 0) {
      return totalSold / count;
    } else {
      return 0;
    }
  };
}
