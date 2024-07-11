# Food Mate E-Commerce System

Food Mate is an online ordering and management system designed to streamline the shopping experience for users and administrators alike.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technical Specifications](#technical-specifications)

## Introduction

Food Mate aims to solve the inconvenience of traditional shopping methods by offering a user-friendly platform for online ordering and management. It consists of a mobile application for clients and a web-based management tool for administrators.

## Features

### Mobile App (Client Side):

- **User Authentication**: Secure login and registration.
- **Product Listing**: View available items categorized by type.
- **Shopping Cart**: Manage selected items before checkout.
- **Checkout and Payment**: Secure payment integration and transaction logging.
- **User Profile Management**: View and edit personal details.

### Website Management Tool (Admin Side):

- **Secure Admin Login**: Access control for administrators.
- **Dashboard**: Overview of key metrics and system status.
- **Product Management**: CRUD operations for product information.
- **User Management**: Manage user accounts and roles.
- **Order Management**: View and process customer orders.
- **Reporting**: Generate reports on sales and product popularity.

## Technical Specifications

### Mobile App:

- **Framework**: React Native
- **Backend**: PHP
- **Database**: MariaDB/MySQL

### Website Management Tool:

- **Frontend**: HTML/PHP
- **Backend**: Java
- **Database**: MariaDB/MySQL

## Database Schema

The project uses MySQL with the following schema:

- User, Product, Order, OrderItem, Role, UserRole, ProductOrderItem
