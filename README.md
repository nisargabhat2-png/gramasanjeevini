PROJECT REQUIREMENTS DOCUMENT
Grama-Sanjeevini – (Healthcare & Rural Pharmacy Network)
Nisarga S Bhat
1. Introduction
Grama-Sanjeevini is an Android application designed to improve healthcare accessibility in rural areas. In
many villages, local medical stores act as the primary source of medical advice and medicine availability.
However, villagers often face difficulties when required medicines are out of stock. This application connects
multiple village medical stores into a unified digital network. It allows users to search for medicines and find
the nearest available store. The app also integrates Generative AI to provide smart suggestions such as
alternative medicines and basic guidance. Grama-Sanjeevini aims to reduce travel time, improve access to
essential medicines, and build collaboration between rural pharmacists.
2. Problem Statement
In rural areas, access to medicines is limited due to lack of coordination between medical stores. If a required
medicine is unavailable in one shop, villagers must travel long distances (10–20 km) without knowing if it is
available elsewhere.There is no centralized system to check medicine availability across nearby villages. This
leads to delays in treatment, increased travel costs, and inconvenience for patients.Additionally, medicines often
expire due to poor inventory tracking, causing wastage and financial loss for pharmacists.
3. Objectives
• To develop an Android app for rural medicine availability tracking
• To connect multiple village medical stores into a single network
• To enable real-time medicine search across nearby locations
• To provide GenAI-based suggestions for alternative medicines
• To reduce travel time for villagers
4. Scope
In Scope
• User search for medicines across nearby shops
• Display availability and distance of stores
• Pharmacist login to update stock
• Special highlighting of life-saving drugs
• GenAI-based alternative medicine suggestions
• Expiry alert system for pharmacists
• Simple and user-friendly interface
5. Functional Requirements
• The system shall allow users to search for medicines
• The system shall display availability across multiple shops
• The system shall show distance of nearby medical stores
• The system shall allow pharmacists to update stock details
• The system shall highlight life-saving drugs with priority
• The system shall generate AI-based alternative suggestions
• The system shall provide expiry alerts for medicines
• The system shall provide search and filter options
6. Non-Functional Requirements
• Performance: The app should display search results within 2–3 seconds
• Reliability: The system should function smoothly without crashes
• Security: User and pharmacy data must be protected
• Usability: Interface should be simple for rural users
• Scalability: The system should support multiple villages and shops
• Compatibility: Should support Android version 9.0 and above
7. User Requirements
Villager (User) Requirements:
• Easy search for required medicines
• Information about nearest available store
• Reduced travel time
• Simple and understandable interface
Pharmacist Requirements:
• Ability to update medicine stock
• Receive expiry alerts
• View demand for medicines
• Easy-to-use system without technical complexity
8. System Requirements
Hardware Requirements:
• Android smartphone
• GPS support
Software Requirements:
• Android OS (version 9 or above)
• Internet connection
• Firebase Firestore (for real-time database)
• Android Studio for development
• GenAI API integration
9. Data Requirements
Medicine Table
• Medicine ID (Primary Key)
• Medicine Name
• Description
• Category (General / Life-Saving)
• Expiry Date
Shop Table:
• Shop ID (Primary Key)
• Shop Name
• Village Name
• Latitude & Longitude
• Contact Details
Inventory Table:
• Inventory ID
• Shop ID (Foreign Key)
• Medicine ID (Foreign Key)
• Stock Quantity
10. Constraints
• Limited development time (6 weeks)
• Dependence on internet connectivity
• Use of free or limited APIs
• Accuracy depends on pharmacist updates
11. Expected Outcome
The Grama-Sanjeevini app will provide a simple and efficient solution for rural healthcare challenges. It
will enable villagers to quickly find required medicines nearby, reducing travel time and improving access
to treatment. The system will also help pharmacists manage their inventory effectively and reduce
medicine wastage through expiry alerts. Overall, the app will create a connected healthcare network in
rural areas, improving accessibility and efficiency.
