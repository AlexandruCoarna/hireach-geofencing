For production run the following commands in docker-compose-prod/hgf:
- ``docker-compose up --build -d``

For development run the following commands in docker-compose-dev/hgf-dev:
- ``docker-compose up --build -d && docker exec -it hgf-dev-express sh -c "npm run start:docker:dev"``


API Endpoints :
- ``POST /target``
    - Creates a new tracking sesion 
    - Required params : 
        - ``id`` 
            - must be unique from a user to another otherwise it will be overwritten
            - it can be string / number
        - ``fence.coords`` 
            - represents the road where the fence monitoring takes place
            - it must be an array of arrays [[latitude,longitude],[latitude,longitude]] , pairs of lat long coordinates representing the area for geofencing.
    - Optional params :
        - ``customAreas``
            - array of custom areas composed of ``id`` and ``point``
            - ``id`` - a name to distinguish different areas
            - ``point`` array of latitude longitude [latitude, longitude]
    - Example of request payload :
     ```
     {
       "id": 1,
       "fence": {
         "coords": [[9.924012, -68.420759], [9.924016, -68.420395], [9.92406, -68.420255]],
         "customAreas": [
           {"id": "some-name", "point": [9.92426, -68.41996]}
         ]
       }
     }   
     ```
- ``PUT /target``
    - Update the position of the target and performs geofencing
    - Required params :
        - ``id`` - the id of the target to update position
        - ``position`` array of latitude longitude [latitude, longitude]
    - Example of request payload
    ```
    {
        "id": 1,
        "position": [9.92426,-68.41996]
    }
    ```
- ``PUT /target/supervisor``
    - Update the list of supervisor for specific target
    - Required params:
        - ``targetId`` - id of the target
        - ``supervisorId`` - id of the supervisor
    - This endpoint requires an already existing supervisor capable of receiving push notifications. If there is no supervisor with valid credentials for push notification, the supervisor won't be added. Check ``/supervisor`` endpoint.
   
- ``DELETE /target/supervisor``
    - Removes a supervisor for a specific target
    - Required params :
        - ``targetId`` - id of the target
        - ``supervisorId`` - id of the supervisor
        
- ``POST /supervisor``
    - Add or update an existing supervisor
    - Required params :
        - ``id`` 
            - the id of the supervisor
            - it must be unique from a supervisor to another otherwise it will be overwritten
            - can be string or number
        - ``subscription``
            - for now this only supports Web Push subscription
            
Push notification setup :
- In the config file ``/src/config-production`` and ``/src/config-development`` there is a ``webPush`` object with 3 keys :
    - privateKey
    - publicKey
    - mailTo
- In order to benefit from automated web push service, you have to generate those credentials for your aplication and put them in the config file, so the API can use them to send notifications
- Check this for Webpush notifications in browsers : https://developers.google.com/web/fundamentals/codelabs/push-notifications
- Example of web push credentials:
```
 {
    privateKey: "mgDcKEWkpo7AXc6UJneeflSsAdZqYkC8l-_ONP8iVXc",
    publicKey: "BDLemtuPfbg6viIoGSgzkkeB211dtacOjHaVCqKEJL88qMuY3mnx44eVCPNYp5Wd54EdbYS8YIhBjPABuRkZvSE",
    mailTo: "mailto:test@test.com"
 }
```