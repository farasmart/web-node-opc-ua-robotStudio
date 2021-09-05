// fetch('/test',{
//     method:post,
//     headers:{
//         'Content-Type': 'application/json'
//     },
//     body:JSON.stringify({
//         user:{
//             id: "1",
//         }
//     })
// })




url = "http://localhost:8081/test";

const func1 = document.getElementById("1");
const func2 = document.getElementById("2");
const func3 = document.getElementById("3");
const func4 = document.getElementById("4");
const stopBtn = document.getElementById("stop");

  const nodeToRead = [
    {
        "nodeId" : "ns=2;i=399",
        "attributeId":"opcua.AttributeIds.Value",
        "value" :{
         "statusCode": "opcua.StatusCodes.Good",
      "value":{
         "dataType":"opcua.DataType.String",
         "value":"lola"
        },
      },
    },
  ];

// fetch('/nodeFunc',).then(data =>{
//     console.log(data);
//     return data.text();
// }).then(data => {
//     console.log(data);
// })


func1.addEventListener('click', async _ => {
    try {     
        const response = await fetch('/test', {
          method: 'post',
          url : '/test',
          headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({
            nodeId: "ns=2;i=399",
            attributeId:"opcua.AttributeIds.Value",
            value :{
             statusCode: "opcua.StatusCodes.Good",
          value:{
             dataType:"opcua.DataType.String",
             value:"lola"
            },
          
        }
        })
        });
        console.log('Completed!', response);
      } catch(err) {
        console.error(`Error: ${err}`);
      }
}
)

func2.addEventListener("click", (e) => {
  console.log("hey 2 ");
});

func3.addEventListener("click", (e) => {
  console.log("hey 3 ");
});
func4.addEventListener("click", (e) => {
  console.log("hey 4");
});
stopBtn.addEventListener("click", (e) => {
  console.log("hey stop");
});


