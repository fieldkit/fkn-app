import RNFS from 'react-native-fs';
import Mailer from 'react-native-mail';
import Promise from "bluebird";

export function emailData(id) {
    return (dispatch, getState) => {
        RNFS.readDir(RNFS.DocumentDirectoryPath).then((res) => {
            return Promise.all([RNFS.stat(res[0].path), res[0].path]);
        }).then(() => {
            const path = RNFS.ExternalDirectoryPath + '/data.csv';
            return RNFS.writeFile(path, 'Time,Depth,Temperature,Conductivity\n', 'utf8');
        }).then(() => {
            return new Promise((resolve, reject) => {
                Mailer.mail({
                    subject: 'FieldKit NOAA-CTD Data',
                    recipients: ['jlewalle@gmail.com'],
                    body: '<p>Please see the attached file, data.csv.</p><br/><p>Thanks!</p>',
                    isHTML: true,
                    attachment: {
                        path: RNFS.ExternalDirectoryPath + '/data.csv',
                        type: 'text/csv',
                        name: 'data.csv',
                    }
                }, (err, ev) => {
                    // Right now, this isn't called unless there's an error.
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(ev);
                    }
                })
            });
        }).catch((err) => {
            console.log(err.message, err.code);
        });
    };
}
