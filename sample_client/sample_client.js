/* global require,console,setTimeout */

//declaration
const opcua = require("node-opcua");
const async = require("async");

// // client setUp
// const endpointUrl =  "opc.tcp://windows-kirhij4:61510/ABB.IRC5.OPCUA.Server"

const endpointUrl =
  "opc.top://" + require("os").hostname() + "61510/ABB.IRC5.OPCUA.Server";

//musthave
const client = opcua.OPCUAClient.create({
  endpointMustExist: false,
});

//adding some helpers to diagnose connection issues
// get idea of the connection progress by adding a event handled
client.on("backoff", (retry, delay) =>
  console.log(
    "still trying to connect to ",
    endpointUrl,
    ": retry =",
    retry,
    "next attempt in ",
    delay / 1000,
    "seconds"
  )
);

// async operations

let the_session, the_subscription;

async.series(
  [
    // step 1 : connect to
    function (callback) {
      //_"Connection"
      client.connect(endpointUrl, function (err) {
        if (err) {
          console.log(" cannot connect to endpoint :", endpointUrl);
        } else {
          console.log("connected !");
        }
        callback(err);
      });
    },

    // step 2 : createSession
    function (callback) {
      //_"create session"
      client.createSession(function (err, session) {
        if (err) {
          return callback(err);
        }
        the_session = session;
        callback();
      });
    },

    // step 3 : browse
    function (callback) {
      //_"browsing the root folder"
      the_session.browse("RootFolder", function (err, browseResult) {
        if (!err) {
          console.log("Browsing rootfolder: ");
          for (let reference of browseResult.references) {
            console.log(
              reference.browseName.toString(),
              reference.nodeId.toString()
            );
          }
        }
        callback(err);
      });
    },

    // step 4 : read a variable with readVariableValue
    function (callback) {
      //_"read a variable with readVariableValue"
      the_session.readVariableValue(
        "ns=1;s=free_memory",
        function (err, dataValue) {
          if (!err) {
            console.log(" free mem % = ", dataValue.toString());
          }
          callback(err);
        }
      );
    },

    // step 4' : read a variable with read
    function (callback) {
      //_"read a variable with read"
      const maxAge = 0;
      const nodeToRead = {
        nodeId: "ns=1;s=free_memory",
        attributeId: opcua.AttributeIds.Value,
      };

      the_session.read(nodeToRead, maxAge, function (err, dataValue) {
        if (!err) {
          console.log(" free mem % = ", dataValue.toString());
        }
        callback(err);
      });
    },

    // step 5: install a subscription and install a monitored item for 10 seconds
    function (callback) {
      //_"install a subscription"
      const subscriptionOptions = {
        maxNotificationsPerPublish: 1000,
        publishingEnabled: true,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        requestedPublishingInterval: 1000,
      };
      the_session.createSubscription2(
        subscriptionOptions,
        (err, subscription) => {
          if (err) {
            return callback(err);
          }

          the_subscription = subscription;

          the_subscription
            .on("started", () => {
              console.log(
                "subscription started for 2 seconds - subscriptionId=",
                the_subscription.subscriptionId
              );
            })
            .on("keepalive", function () {
              console.log("subscription keepalive");
            })
            .on("terminated", function () {
              console.log("terminated");
            });
          callback();
        }
      );
    },
    function (callback) {
      //_"add some monitored items"
      
// install monitored item
const itemToMonitor = {
    nodeId: opcua.resolveNodeId("ns=1;s=free_memory"),
    attributeId: opcua.AttributeIds.Value
  };
  const monitoringParamaters = {
          samplingInterval: 100,
          discardOldest: true,
          queueSize: 10
  };
  
  const monitoredItem  = suor(
      itemToMonitor,
      monitoringParamaters,
      opcua.TimestampsToReturn.Both
  );
  console.log("-------------------------------------");
  
  monitoredItem.on("changed", function(dataValue) {
     console.log("monitored item changed:  % free mem = ", dataValue.value.value);
  });
  
    },
    function (callback) {
      // wait a little bit : 10 seconds
      setTimeout(() => callback(), 10 * 1000);
    },
    // terminate session
    function (callback) {
      //_"stopping subscription";
      the_subscription.terminate(callback);

    },
    // close session
    function (callback) {
      //_"closing session"
      the_session.close(function (err) {
        if (err) {
          console.log("closing session failed ?");
        }
        callback();
      });
    },
  ],
  function (err) {
    if (err) {
      console.log(" failure ", err);
    } else {
      console.log("done!");
    }
    client.disconnect(function () {});
  }
);
