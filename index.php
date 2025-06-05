<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
</head>
<body>
    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG" width = "600" height = "400">
    </canvas>

    <script>
      console.log(2);
    </script>     
  
    <script type="module">
      import { frame } from "./js/engine/frame/frame.mjs";

      const fr = await new frame("The_only_normal_group_for_the_entire_time_at_the_CGSG");

      fr.mainloop();
      // await rnd.init();
      
      // async function loop() {
      //   await rnd.render();
      //   requestAnimationFrame(loop);
      // }
      // loop();
      
</script>
</body>
</html>
