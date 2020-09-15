import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Dealership } from '../models/Dealership';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  details: Observable<any>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Get dealership details
  getDealershipDetails(): Observable<Dealership> {
    // Get user ID
    const loggedInUserId = this.afAuth.auth.currentUser.uid;

    // Get data from Firebase - where ID matches
    this.details = this.db
      .collection('details', (ref) => ref.where('userId', '==', loggedInUserId))
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as any;
            data.id = action.payload.doc.id;
            return data;
          });
        })
      );

    return this.details;
  }

  // Form data and document ID passed in
  updateDetails(form, docId) {
    this.db.collection('details').doc(docId).update(form);
  }

  // Add dealership details - get ID and add to details passed in from component
  addDetails(details) {
    const loggedInUserId = this.afAuth.auth.currentUser.uid;
    this.db.collection('details').add({ ...details, userId: loggedInUserId });
  }
}
