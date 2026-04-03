async function run() {
  const form = new FormData();
  form.append('title', 'Test Notice');
  form.append('description', 'Test Description');
  form.append('isPublic', "false"); // Note string value to mimic frontend

  try {
    const res = await fetch('http://localhost:8000/notice', {
      method: "POST",
      body: form
    });
    const resData = await res.json();
    console.log("POST /notice response:", JSON.stringify(resData, null, 2));

    if (resData.data && resData.data.id) {
       console.log("Created notice ID:", resData.data.id);
       const form2 = new FormData();
       form2.append('title', 'Test Notice 2');
       form2.append('isPublic', "true"); // string true
       
       const res2 = await fetch(`http://localhost:8000/notice/${resData.data.id}`, {
         method: "PATCH",
         body: form2
       });
       const patchData = await res2.json();
       console.log("PATCH /notice response:", JSON.stringify(patchData, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}
run();
