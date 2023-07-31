package com.luv2code17.springbootecommerce17.dao;

import com.luv2code17.springbootecommerce17.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
