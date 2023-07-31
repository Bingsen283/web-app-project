import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/states';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2shopFormService } from 'src/app/services/luv2shop-form.service';
import { Luv2shopValidators } from 'src/app/validators/luv2shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  shippingFee: number = 0.00;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private luv2shopFormService: Luv2shopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) {
  }

  ngOnInit(): void {
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2shopFormService.getCreditCardMontns(startMonth).subscribe(
      data => { this.creditCardMonths = data }
    );

    this.luv2shopFormService.getCreditCardYears().subscribe(
      data => { this.creditCardYears = data }
    );

    this.luv2shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }

    );

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2shopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2shopValidators.notOnlyWhiteSpace]),
        email: new FormControl("",
          [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", Validators.required),
        country: new FormControl("", Validators.required),
        zipCode: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace]),
        city: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace]),
        state: new FormControl("", Validators.required),
        country: new FormControl("", Validators.required),
        zipCode: new FormControl("", [Validators.required, Luv2shopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl("", Validators.required),
        nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2),
        Luv2shopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl("",
          [Validators.required, Validators.pattern("[0-9]{16}")]),
        securityCode: new FormControl("",
          [Validators.required, Validators.pattern("[0-9]{3}")]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.listOrderDetail();
  }

  listOrderDetail() {
    this.cartService.totalPrice.subscribe(
      data => { this.totalPrice = data }
    );

    this.cartService.totalQuantity.subscribe(
      data => { this.totalQuantity = data }
    );

    this.cartService.shippingFee.subscribe(
      data => { this.shippingFee = data }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shipStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shipCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shipState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shipCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shipZip() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billZip() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  onSubmit() {
    console.log("Handling the submit button");

    console.log(this.checkoutFormGroup.controls['shippingAddress'].value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // console.log(this.checkoutFormGroup.controls['shippingAddress'].value.country.name);

    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tempItem => new OrderItem(tempItem));

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    console.log(purchase.shippingAddress.state);
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`);

        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    }
    );


  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  copyShippingToBilling(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }

  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2shopFormService.getCreditCardMontns(startMonth).subscribe(
      data => {
        (this.creditCardMonths = data);
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;

    this.luv2shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === "shippingAddress") {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup.get("state").setValue(data[0]);
      }
    );

  }


}
