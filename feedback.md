# General
1. No se eliminó la carpeta por defecto `tests-examples`, ni el archivo `example.spect.ts` dentro de la carpeta `tests`.
2. Mejora: hacer uso de annotations https://playwright.dev/docs/test-annotations#tag-tests.

# API
1. El `pokemon.spec.ts` contiene también lo vinculado a jsonplaceholder el cual no tiene relación, haría la división en dos archivos. 
2. La creación de fixture se podría haber puesto en un archivo aparte para no "ensuciar" el .spec, y, vinculado a lo anterior, se podría hacer uso del fixture en varios lugares. Además, el console.log con la clave encriptada y con la fecha y hora de finalización del test, también se podría haber indicado dentro del fixture.

## Pokémon
1. Hay un único test, cuando en realidad se podría hacer que cada dato de prueba en el excel sea un test, esto permitiría mantener independencia y además permitiría escabilidad (se podría configurar para que haya N workers y que cada uno ejecute los tests en paralelo).

# Web
1. Hay un único test, cuando en realidad se podría hacer que cada dato de prueba en el excel sea un test, esto permitiría mantener independencia y además permitiría escabilidad (se podría configurar para que haya N workers y que cada uno ejecute los tests en paralelo).
2. El título lo validaría con `toBe` en vez de `toContain` dado que sino podría tender a falsos positivos.
3. La manera en la se creó la la page object no es escalable, se hace uso de `document` en cada función, en vez de hacer tener los locators definidos en el constructor.