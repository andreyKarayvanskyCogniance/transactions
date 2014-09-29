To run the application you will need:

	Java 8
	Gradle


Run the following commands:

	transactions> gradle build
	transactions> gradle bootRun

The application will be avaliable on

	http://localhost:8080/

Alternatively you can deploy WAR from `transactions-web/build` to your favorite web app container (Tomcat or Jetty).

No database installation required. H2 in memory is currently used. With Spring Data JPA H2 can be replaced with any commonly available relational database like MySql or Postgresql.
