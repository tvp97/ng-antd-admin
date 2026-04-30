# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

FROM openjdk:11
ADD build/libs/svc-vote-1.0.0.jar svc-vote-1.0.0.jar
ADD src/main/resources/db /db
ENV _JAVA_OPTIONS="-Xms1024m -Xmx3560m"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "svc-vote-1.0.0.jar"]
