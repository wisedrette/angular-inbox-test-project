import moment from 'moment';

class HomeCtrl {
    constructor($scope, $rootScope) {
        'ngInject';

        $scope.messages = [];
        $scope.pageToken = '';
        $scope.loadMore = $rootScope.loadMore;

        $scope.getEmailsList = function (newValue, oldValue) {
            if (newValue && !oldValue) {
                gapi.client.request(
                    {
                        'path': '/gmail/v1/users/me/messages',
                        'method': 'GET',
                        'params': {
                            maxResults: 20,
                            labelIds: "INBOX",
                            pageToken: $scope.pageToken
                        },
                        'callback': $scope.getEmailsData
                    }
                );
            }
        };

        $rootScope.$watch('signedIn', function (newValue, oldValue) {
            if (!newValue && oldValue) {
                $scope.messages = [];
                $scope.pageToken = '';
                $rootScope.loadMore = false;
                return;
            }
            $scope.getEmailsList(newValue, oldValue)
        });

        $rootScope.$watch('loadMore', $scope.getEmailsList);

        $scope.getEmailsData = function (result) {
            function extractField(json, fieldName) {
                try {
                    return json.payload.headers.filter(function (header) {
                        return header.name === fieldName;
                    })[0].value;
                } catch (err) {
                    return ''
                }
            }

            let messages = result.messages;
            let requests = result.messages.map((message, index) => {
                return new Promise((resolve) => {
                    gapi.client.request({
                        'path': `/gmail/v1/users/me/messages/${message.id}`,
                        'method': 'GET',
                        'callback': function (res) {
                            message.snippet = res.snippet;
                            message.image = 'http://placehold.it/60x60';

                            message.subject = extractField(res, "Subject");
                            message.from = extractField(res, "From");
                            message.date = extractField(res, "Date");
                            message.parts = res.payload.parts;
                            message.body = '';
                            if (!message.parts) {
                                message.body = res.payload.body;
                            }
                            message.showBody = false;
                            messages[index] = message;
                            resolve();
                        }
                    });
                });
            }, Promise.resolve());
            $scope.pageToken = result.nextPageToken;

            Promise.all(requests).then(() => {
                $rootScope.loadMore = false;
                $scope.loadMore = false;
                $scope.messages = $scope.messages.concat(messages);
                $scope.$apply();
            });
        };

        $scope.showBody = function (item) {
            item.showBody = !item.showBody;
            if (item.showBody) {
                let part;
                if (!item.parts) {
                    part = item.body
                } else {
                    part = item.parts.filter(part => part.mimeType == 'text/html');
                    if (!part.length) {
                        part = item.parts[0].parts.filter(function (part) {
                            return part.mimeType == 'text/html';
                        });
                    }
                    part = part[0].body
                }
                item.body = atob(part.data.replace(/-/g, '+').replace(/_/g, '/'));
            }
        };

        $scope.displayDate = function (i) {
            if (i == 0) {
                return $scope.elapsedTime($scope.messages[i].date)
            } else {
                let date = $scope.elapsedTime($scope.messages[i].date);
                let prevDate = $scope.elapsedTime($scope.messages[i - 1].date);
                if (date != prevDate) {
                    return date
                }
            }
            return undefined
        };

        $scope.elapsedTime = function (time) {
            if (!time) return;
            let date = moment(time).startOf('day'),
                today = moment().startOf('day'),
                days = moment.duration(today.diff(date)).get('days');

            if (days == 0) {
                return "Today"
            } else if (days == 1) {
                return "Yesterday"
            } else if (days < 7) {
                return "This week"
            } else {
                return date.format('MMM Do YY');
            }
        };

    }
}

export default HomeCtrl;
