prism.run(['$q', '$http', function ($q, $http) {
var globalDatasourceAliasing_en = {
    "dashboards": {
        "Marks Translation PoC": "Marks Translation PoC TRANSLATED"
    },
    "folders": {
        "Drafts": "Drafts and WIP"
    }
};
var globalDatasourceAliasing_fr = {
    "dashboards": {
        "Marks Translation PoC": "Marks Traduction PoC TRADUCTION"
    },
    "folders": {
        "Drafts": "Brouillons et travaux en cours"
    }
};
var globalDatasourceAliasing = {
    "en": globalDatasourceAliasing_en,
    "fr": globalDatasourceAliasing_fr
};

    var datasourceAliasing = {
        "tables": {
            "FACT_Pat": "Patents",
            "category": "категория",
            "country": "страна",
            "commerce": "коммерция"
        },
        "formulas": {
            "Revenue": "Чистый доход"
        },
        "hierarchies": {
            "Category by Brand and Age Range": "Категория через Бренд и Год"
        },
        "titles": {
            "CUSTOM REVENUE": "ДОХОДЫ"
        },
        "columns": {
            "Brand": {
                "Brand": "Бренд",
                "Brand ID": "Бренд Id"
            },
            "Category": {
                "Category": "Категория",
                "Category ID": "Id Категории"
            },
            "Commerce": {
                "Age Range": "Возрастные диапазоны",
                "Brand ID": "Id Бренда",
                "Category ID": "Id Категории",
                "Condition": "Состояние",
                "Cost": "Затраты",
                "Country ID": "Id Страны",
                "Date": "Дата",
                "Gender": "Пол",
                "Quantity": "Количество",
                "Revenue": "Доходы",
                "Visit ID": "Id Посетителя"
            },
            "Country": {
                "Country ID": "Id Страны",
                "Country": "Страна"
            }
        },
        "widgets": {
            "My English Title": "My TRANSLATED widget Title"
        },
    };

    function getGroups() {
        console.log('getGroups');
        console.log(prism.user.preferences.language);
        return $q.resolve()
            .then(function () {
                if (prism && prism.user && prism.user.groupsName) {
                    return prism.user.groupsName;
                }
                return null;
            });
    }

    function globalDatasourceProvider(resolve, reject) {
 getGroups()
  .then(function (groups) {
      if (!groups) {
    $.ajax({
        url: '/api/users/loggedin',
        async: false,
        success: function(response) {
      groups = response.groupsName
        }
    })
      }
      var hasTestGroup = (groups || []).some(function (group) {
    return group.name === 'Development';
      });
      if (hasTestGroup) {
          debugger;
    resolve(globalDatasourceAliasing[prism.user.preferences.language.split('-')[0]]);
      } else {
    resolve();
      }
  })
  .catch(reject);
    }

    function datasourceProvider(datasourceId, resolve, reject) {
        getGroups()
            .then(function (groups) {
                var hasTestGroup = (groups || []).some(function (group) {
                    return group.name === 'Development';
                });
                if (hasTestGroup) {
                    resolve(datasourceAliasing);
                } else {
                    resolve();
                }
            })
            .catch(reject);
    }

    prism.on('beforealiascontextinit', function (ev, args) {
        // register functions that provides aliasing context.
        args.register(datasourceProvider, globalDatasourceProvider, 2000);
    });
}]);
