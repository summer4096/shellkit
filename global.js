var shellkit = require('./')
for (var item in shellkit) {
  global[item] = shellkit[item]
}
