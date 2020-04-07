import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var stripe;
declare var elements;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'stripe-demo';
  cardNumber;
  cardExpiry;
  cardCvc;

  constructor(private http: HttpClient) { }

  registerElements() {
    var form = document.querySelector('form');
    // // Listen on the form's 'submit' handler...
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.stripeConfirmPayment()
    });
    this.cardNumber.on('change', function (event) {
      var displayError = document.getElementById('card-number-error-message');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
    this.cardExpiry.on('change', function (event) {
      var displayError = document.getElementById('card-expiry-error-message');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
    this.cardCvc.on('change', function (event) {
      var displayError = document.getElementById('card-cvv-error-message');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  ngAfterViewInit(): void {
    this.cardNumber = elements.create('cardNumber');
    this.cardExpiry = elements.create('cardExpiry');
    this.cardCvc = elements.create('cardCvc');

    this.cardNumber.mount('#card-number');
    this.cardExpiry.mount('#card-expiry');
    this.cardCvc.mount('#card-cvc');
    this.registerElements();
  }


  stripeConfirmPayment() {
    const cardHolderName = (<any>document).querySelector('#cardHolderName').value;
    //API to get client_secret from backend
    this.http.get('http://localhost:3000/get_payment_intent').subscribe((res: any) => {
      if (res) {
        console.log(res);
        stripe.confirmCardPayment(res.client_secret, {
          payment_method: {
            card: this.cardNumber,
            billing_details: {
              name: cardHolderName
            }
          }
        }).then((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.errors)
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              console.log(result.paymentIntent.status);
              //you can add you aactions that you need to perform after successfull payment!
            }
          }
        });
      }
    })
  }
}

