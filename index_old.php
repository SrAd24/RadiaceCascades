<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
    <link rel="icon" href="./bin/favicon/favicon2.jpg" type="image/jpg">
    <link rel="shortcut icon" href="./bin/favicon/favicon2.jpg" type="image/jpg">
</head>
<body id="body">
    <?php
      $mysql = mysqli_connect("viperr.space", "viperr", "Im_bot228", "viperr");

      if ($mysql == false)
         echo "can`t connect";
       else
         echo "connected";
    ?>

    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG" width = "512" height = "512">
    </canvas>
<<<<<<< HEAD:index.php
=======

    <input type="color" id="colorPicker" name="colorPicker" value="#000000">
    <input type="range" id="brushSize" min="5" max="20" value="7">
  
>>>>>>> refs/remotes/origin/main:index_old.php
    <script type="module">
      import { uni_test } from './js/samples/uni_test.mjs';
      //import { uni_tex } from './js/samples/uni_tex.mjs';
      import { uni_control } from './js/samples/uni_control.mjs';
      import { uni_clicker } from './js/samples/uni_clicker.mjs';
    </script>
  
    <script type="module">
      import { anim } from './js/engine/anim/anim.mjs';

      let animation = new anim();
      async function loop() {
        await animation.init('The_only_normal_group_for_the_entire_time_at_the_CGSG');
        await animation.mainloop();
      }
      await loop();

</script>
</body>
</html>
