<html lang="en">
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
      $mysql = mysqli_connect("viperr.space", "root", "Im_bot228", "viperr");

      if ($mysql == false)
         echo "can`t connect";
       else
         echo "connected";
    ?>

    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG" width = "800" height = "600">
    </canvas>

    <script type="module">
      import { uni_test } from './js/samples/uni_test.mjs';
      import { uni_control } from './js/samples/uni_control.mjs';
      import { uni_clicker } from './js/samples/uni_clicker.mjs';
    </script>
  
    <script type="module">
      import { anim } from './js/engine/anim/anim.mjs';

      // const fr = new frame();
      // const as = async () => {
      //   await fr.init("The_only_normal_group_for_the_entire_time_at_the_CGSG");
      //   await fr.mainloop()
      // };

      // await as();

      let animation = new anim();
      async function loop() {
        await animation.init('The_only_normal_group_for_the_entire_time_at_the_CGSG');
        await animation.mainloop();
      }
      await loop();

</script>
</body>
</html>



<!-- <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
</head>
<body>
    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG" width = "600" height = "400">
    </canvas>

    <script type="module">
      import { uni_test } from './js/samples/uni_test.mjs';
    </script>
  
    <script type="module">
      import { frame } from "./js/engine/frame/frame.mjs";
      import { anim } from './js/anim/anim.mjs';

      //const fr = await new frame("The_only_normal_group_for_the_entire_time_at_the_CGSG");
      //fr.mainloop();
      
      let animation = new anim();
      async function loop() {
        await animation.init('#The_only_normal_group_for_the_entire_time_at_the_CGSG');
      }
      await loop();
      
      // await rnd.init();
      
      // async function loop() {
      //   await rnd.render();
      //   requestAnimationFrame(loop);
      // }
      // loop();
      
</script>
</body>
</html>
 -->