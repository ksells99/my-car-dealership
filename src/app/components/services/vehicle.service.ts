import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Vehicle } from '../models/Vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  vehicles: Observable<Vehicle[]>;
  availableVehicles: Observable<Vehicle[]>;
  soldVehicles: Observable<Vehicle[]>;

  vehicleDoc: AngularFirestoreDocument<Vehicle>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {}

  getAllUserVehicles(): Observable<Vehicle[]> {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    this.vehicles = this.db
      .collection('vehicles', (ref) =>
        ref.where('userId', '==', loggedInUserId)
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Vehicle;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );

    return this.vehicles;
  }

  getAvailableUserVehicles(): Observable<Vehicle[]> {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    this.availableVehicles = this.db
      .collection('vehicles', (ref) =>
        ref
          .where('userId', '==', loggedInUserId)
          .where('status', '==', 'unsold')
          .orderBy('registration', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Vehicle;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );

    return this.availableVehicles;
  }

  getSoldUserVehicles(): Observable<Vehicle[]> {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    this.soldVehicles = this.db
      .collection('vehicles', (ref) =>
        ref
          .where('userId', '==', loggedInUserId)
          .where('status', '==', 'sold')
          .orderBy('saleDate', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as Vehicle;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );

    return this.soldVehicles;
  }

  addVehicle(vehicle: Vehicle) {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    this.db.collection('vehicles').add({ ...vehicle, userId: loggedInUserId });
  }

  updateVehicle(vehicle: Vehicle) {
    this.vehicleDoc = this.db.doc(`vehicles/${vehicle.id}`);

    this.vehicleDoc.update(vehicle);
  }
}
