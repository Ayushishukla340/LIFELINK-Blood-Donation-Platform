# LifeLink Feature Guide

## User Accounts
Users can register and log in using the account workflows provided by the application. Access to protected features depends on authentication and the user's role.

## Donor Discovery
The donor search interface supports searching by blood group and city. Results depend on the donor records stored in the database and the active filters.

## Blood Requests
Patients can submit blood requests and follow request status. The application includes donor response workflows and administrative status management.

## Notifications
The notification feature communicates relevant blood-request events to users.

## Donor Availability
Donors can update their availability. Search and request workflows should respect availability rules implemented by the backend.

## Administration
Administrative pages provide workflows for reviewing requests and managing their statuses. Administrative actions should remain restricted to authorized accounts.

## Notes
This document describes the application's intended workflows. Refer to the current source code and configuration for exact endpoint names, validations, and status transition rules.
