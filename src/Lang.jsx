import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IntlProvider, injectIntl} from 'react-intl';
import moment from 'moment'
import merge from 'deepmerge'
import {compose, withProps, getContext, withContext} from 'recompose';

const flags = {
  mx: {
    lang: 'es',
    code: 'es-mxs'
  },
  us: {
    lang: 'en',
    code: 'en-us'
  },
  de: {
    lang: 'de',
    code: 'de'
  }
};

export const getSelectedLang = (flag) => {
  return {
    flag,
    ...flags[flag]
  };
}

export const LangProvider = compose(
/**/
withContext({
  flag: PropTypes.string
}, ({flag}) => ({flag}))
/**/)(({children}) => (<div>{children}</div>));

export const withLang = (inmsg) => BaseComponent => compose(
/***/
getContext({flag: PropTypes.string, messages: PropTypes.object}),
/**/
withProps(({flag, messages}) => ({
  selected: getSelectedLang(flag),
  combined: merge(inmsg, (messages || {}))
})),
/***/
withContext({
  messages: PropTypes.object
}, ({combined}) => ({messages: combined}))
/**/)((props) => {
  const {
    combined,
    selected: {
      code,
      lang
    }
  } = props;
  const Rebase = injectIntl(BaseComponent);
  return (<IntlProvider locale={code} messages={combined[lang]}>
    <Rebase { ...props }/>
  </IntlProvider>);
})
