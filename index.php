<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
</head>
<body>
    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG">
    </canvas>

    <script>
      console.log(2);
    </script>     
  
    <script type="module">
      import { render } from "./js/engine/webGPU/render.mjs";

      const rnd = new render();

      await rnd.initialize();
      async function mainloop() {
        await rnd.render();
        requestAnimationFrame(mainloop);
      }
      mainloop();
      
</script>
</body>
</html>
