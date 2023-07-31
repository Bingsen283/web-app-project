package com.luv2code17.springbootecommerce17.service;

import com.luv2code17.springbootecommerce17.dto.Purchase;
import com.luv2code17.springbootecommerce17.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
