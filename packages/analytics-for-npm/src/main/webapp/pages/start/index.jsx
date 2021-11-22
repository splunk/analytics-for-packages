import React from 'react';

import layout from '@splunk/react-page';
import NpmAnalyzer from '@splunk/npm-analyzer';
import { SplunkThemeProvider } from '@splunk/themes';
import Button from '@splunk/react-ui/Button';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';

import { StyledContainer, StyledGreeting } from './StartStyles';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');

layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <StyledContainer>
            <StyledGreeting>NPM Analyzer</StyledGreeting>
            <NpmAnalyzer name="from inside NpmAnalyzer" />
        </StyledContainer>
    </SplunkThemeProvider>
);
