<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radiance cascades forever</title>
    <link rel="stylesheet" href="./src/styles/css/style.css">
    <link rel="icon" href="./bin/favicon/favicon.png" type="image/png">
    <link rel="shortcut icon" href="./bin/favicon/favicon.png" type="image/png">
</head>
<body id="body">
    <canvas id = "The_only_normal_group_for_the_entire_time_at_the_CGSG" width = "800" height = "600">
    </canvas>
    <script type="module">
      import { uni_test } from './js/samples/uni_test.mjs';
      //import { uni_tex } from './js/samples/uni_tex.mjs';
      import { uni_control } from './js/samples/uni_control.mjs';
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
