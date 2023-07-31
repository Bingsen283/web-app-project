package com.luv2code17.springbootecommerce17.dto;

import com.luv2code17.springbootecommerce17.entity.Address;
import com.luv2code17.springbootecommerce17.entity.Customer;
import com.luv2code17.springbootecommerce17.entity.Order;
import com.luv2code17.springbootecommerce17.entity.OrderItem;
import lombok.Data;

import java.security.PrivateKey;
import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
