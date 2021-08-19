/*global require,console,setTimeout */
const opcua = require("node-opcua");
const async = require("async");

// var serverCertificateFileName = {
//   serverCertificate: crypto_utils.readCertificate("sample_client/mycertificate.pem")
// }

// try this to connect,nothing
//2021-08-18 11:22:55.816 +03:00 [INF] opc.tcp://windows-kirhij4:61510/ABB.IRC5.OPCUA.Server
const endpointUrl = "opc.tcp://" + "localhost" + ":61510/ABB.IRC5.OPCUA.Server";
const client = opcua.OPCUAClient.create({
  endpoint_must_exist: false,
});
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


let the_session, the_subscription;

async.series(
  [
    // step 1 : connect to
    function (callback) {
      client.connect(endpointUrl, function (err) {
        if (err) {
          console.log(" cannot connect to endpoint :", endpointUrl);
        } else {
          console.log("connected !");
         
        }
        callback(err);
      });
    },

function (callback) {
  const applicationDescription = client.findEndpointForSecurity(
    opcua.MessageSecurityMode.SIGN,
    opcua.SecurityPolicy.Basic256Sha256
);

client = new opcua.OPCUAClient({
    securityMode: opcua.MessageSecurityMode.SIGN,
    securityPolicy: opcua.SecurityPolicy.Basic256Sha256
});

},

    // step 2 : createSession
    // function (callback) {
    //   client.createSession(function (err, session) {
    //     if (err) {
    //       return callback(err);
    //     }
    //     the_session = session;
    //     callback();
    //   });
    // },

    // step 3 : browse
    // function (callback) {
    //   the_session.browse("RootFolder", function (err, browseResult) {
    //     if (!err) {
    //       console.log("Browsing rootfolder: ");
    //       for (let reference of browseResult.references) {
    //         console.log(
    //           reference.browseName.toString(),
    //           reference.nodeId.toString()
    //         );
    //       }
    //     }
    //     callback(err);
    //   });
    // },

    // step 4 : read a variable with readVariableValue
    // function (callback) {
    //   the_session.readVariableValue(
    //     "ns=1;s=free_memory",
    //     function (err, dataValue) {
    //       if (!err) {
    //         console.log(" free mem % = ", dataValue.toString());
    //       }
    //       callback(err);
    //     }
    //   );
    // },

    // step 4' : read a variable with read
    // function (callback) {
    //   const maxAge = 0;
    //   const nodeToRead = {
    //     nodeId: "ns=1;s=free_memory",
    //     attributeId: opcua.AttributeIds.Value,
    //   };

    //   the_session.read(nodeToRead, maxAge, function (err, dataValue) {
    //     if (!err) {
    //       console.log(" free mem % = ", dataValue.toString());
    //     }
    //     callback(err);
    //   });
    // },

    // step 5: install a subscription and install a monitored item for 10 seconds
    // function (callback) {
    //   const subscriptionOptions = {
    //     maxNotificationsPerPublish: 1000,
    //     publishingEnabled: true,
    //     requestedLifetimeCount: 100,
    //     requestedMaxKeepAliveCount: 10,
    //     requestedPublishingInterval: 1000,
    //   };
    //   the_session.createSubscription2(
    //     subscriptionOptions,
    //     (err, subscription) => {
    //       if (err) {
    //         return callback(err);
    //       }

    //       the_subscription = subscription;

    //       the_subscription
    //         .on("started", () => {
    //           console.log(
    //             "subscription started for 2 seconds - subscriptionId=",
    //             the_subscription.subscriptionId
    //           );
    //         })
    //         .on("keepalive", function () {
    //           console.log("subscription keepalive");
    //         })
    //         .on("terminated", function () {
    //           console.log("terminated");
    //         });
    //       callback();
    //     }
    //   );
    // },
    // function (callback) {
    //   // install monitored item
    //   const monitoredItem = the_subscription.monitor(
    //     {
    //       nodeId: opcua.resolveNodeId("ns=1;s=free_memory"),
    //       attributeId: opcua.AttributeIds.Value,
    //     },
    //     {
    //       samplingInterval: 100,
    //       discardOldest: true,
    //       queueSize: 10,
    //     },
    //     opcua.TimestampsToReturn.Both
    //   );
    //   console.log("-------------------------------------");

    //   monitoredItem.on("changed", function (dataValue) {
    //     console.log(
    //       "monitored item changed:  % free mem = ",
    //       dataValue.value.value
    //     );
    //   });
    // },
    function (callback) {
      // wait a little bit : 10 seconds
      setTimeout(() => callback(), 10 * 1000);
    },
    // terminate session
    // function (callback) {
    //   the_subscription.terminate(callback);
    // },
    // close session
    function (callback) {
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
