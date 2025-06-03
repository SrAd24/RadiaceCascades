<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
</head>
<body>
    <?php
      echo 52
    ?>
    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG">
    </canvas>

    <script>
      console.log(2);
    </script>     
  
    <script type="module">
      import { render } from "./src/engine/webGPU/render.js";
      
      const rnd = new render();
      (async () => {
        await rnd.initialize();
        while (1)
          await rnd.render();
      })();
     
</script>
</body>
</html>
