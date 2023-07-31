package com.luv2code17.springbootecommerce17.service;

import com.luv2code17.springbootecommerce17.dao.CustomerRepository;
import com.luv2code17.springbootecommerce17.dto.Purchase;
import com.luv2code17.springbootecommerce17.dto.PurchaseResponse;
import com.luv2code17.springbootecommerce17.entity.Customer;
import com.luv2code17.springbootecommerce17.entity.Order;
import com.luv2code17.springbootecommerce17.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImply implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImply(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
