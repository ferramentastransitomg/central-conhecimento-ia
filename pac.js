function FindProxyForURL(url, host) {
    lurl=url.toLowerCase();
    lhost=host.toLowerCase();
    ihost=dnsResolve(lhost);
    if (shExpMatch(url, "http://*.prodemge.gov.br/*")) return "DIRECT";
    if (shExpMatch(url, "http://*.pcnet.mg.gov.br/*")) return "DIRECT";
    if (shExpMatch(url, "http://*.icn-api.tse.jus.br/*")) return "DIRECT";
    if (shExpMatch(url, "http://*.pc.mg.gov.br/*")) return "DIRECT";
    if (shExpMatch(url, "http://*.policiacivil.mg.gov.br/*")) return "DIRECT";
    if (shExpMatch(url, "http://*.elo.com.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://*.almg.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://capturaweb-homolog.si.valid.com.br:4444/id-mg/capturaweb/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://*.valid.com.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://*.valid.com.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://*.sistemas.pucminas.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://*.ouvidoria.prodemge.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://sgp.eti.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://sankhyaw.metodotelecom.com.br:90/*")) return "PROXY proxy5-1.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://*.sistemas.pucminas.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if ((shExpMatch(url, "ftp://transfer.correios.com.br/*")) && (isInNet(myIpAddress(), "192.168.38.40", "255.255.255.255"))) return "DIRECT";
    if (shExpMatch(url, "http://*.fazenda.mg.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://*.fazenda.mg.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://coaf.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://www.coaf.gov.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "https://meet.google.com/*")) return "PROXY proxy5-9.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://www.joaob.com.br/*")) return "PROXY proxy5.pc.mg.gov.br:3128";
    if (shExpMatch(url, "http://www.imlbh.med.br/*")) return "PROXY proxy5-8.pc.mg.gov.br:3128";
    if (isInNet(ihost, "189.85.140.230","255.255.255.255")) {return "PROXY proxy5.pc.mg.gov.br:3128";}
    if (isInNet(ihost, "24.152.39.39","255.255.255.255")) {return "PROXY proxy5.pc.mg.gov.br:3128";}
    if (isInNet(ihost, "8.242.50.252","255.255.255.255")) {return "DIRECT";}
    if (isInNet(ihost, "187.29.147.252","255.255.255.255")) {return "DIRECT";}
    if (isInNet(ihost, "187.4.152.252","255.255.255.255")) {return "DIRECT";}
    if (isInNet(ihost, "8.242.34.214","255.255.255.255")) {return "PROXY proxy5.pc.mg.gov.br:3128";}
    if (isInNet(ihost, "200.198.15.8","255.255.255.255")) {return "PROXY proxy5.pc.mg.gov.br:3128";}
    if ((isInNet(ihost, "200.198.0.0", "255.255.192.0")) || (isInNet(ihost, "172.16.0.0", "255.240.0.0")) ||  (isInNet(ihost, "192.168.0.0","255.255.0.0")) || (isInNet(ihost, "10.0.0.0", "255.0.0.0")) || (isInNet(ihost, "127.0.0.1","255.255.255.255")) || (isInNet(ihost, myIpAddress(), "255.255.255.255")) ) {
        if (isInNet(ihost, "200.198.230.120","255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128";} 
        return "DIRECT"; }
    if (isInNet(myIpAddress(), "10.60.190.0", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.8", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.16", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.24", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.32", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.40", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.48", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.56", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.64", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.72", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.80", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.88", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.96", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.106", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.104", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.112", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.120", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.128", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.136", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.144", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.152", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.160", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.168", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.176", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.184", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.192", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.200", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.208", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.216", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.224", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.232", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.240", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.190.248", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.0", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.8", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.16", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.24", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.32", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.40", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.48", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.56", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.64", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.72", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.80", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.96", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.104", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.112", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.120", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.128", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.136", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.144", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.152", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.160", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.168", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.176", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.184", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.192", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.200", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.208", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.216", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.224", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.232", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.240", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.191.248", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.0", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.8", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.16", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.24", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.32", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.40", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.48", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.56", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.64", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.72", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.80", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.96", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.104", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.112", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.120", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.128", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.136", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.144", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.152", "255.255.255.248")) { return "PROXY proxy4-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.160", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.168", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.176", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.184", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.192", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.200", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.208", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.216", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.224", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.232", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.240", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.192.248", "255.255.255.248")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.90", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.196.81", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.213", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.214", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.164.94", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.74.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.246.10", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.97.0", "255.255.255.0")) { return "PROXY localhost:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.5", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.14", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.21", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.234", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.239", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.19.237.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.33.188", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.33.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.10.121", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.10.150", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.10.151", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.10.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.47.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.83", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.87", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.167", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.169", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.171", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.174", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.176", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.177", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.178", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.46.55.12", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.211", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.52.66", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.207.37", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.140.127", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.207.86", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.189.210", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.206.65", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.34.215.2", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.206.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.71.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.34.79.99", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.72.5", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.8", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.159", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.251", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.196", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.40.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.46.195.20", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.46.195.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.205", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.211", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.137.33", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.137.180", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.140", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.97", "255.255.255.255")) { return "PROXY proxy6.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.93", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.151", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.109", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.76", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.40", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.41", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.39", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.38.0/24", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.254.0", "255.255.255.0")) { return "PROXY proxycamg.prodemge.gov.br:8080"; }
    if (isInNet(myIpAddress(), "10.12.72.0", "255.255.255.0")) { return "PROXY proxycamg.prodemge.gov.br:8080"; }
    if (isInNet(myIpAddress(), "10.18.70.201", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.15.218.0", "255.255.255.0")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.15.220.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.114.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.179.11", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.179.240", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.179.250", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.40.131", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.34.196", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.34.213.98", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.34.11.179", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.224.14", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.41.9", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.86.4", "255.255.255.255")) { return "PROXY carbono.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.246.237", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.246.212", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.38", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.239", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.242", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.234", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.244", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.246", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.51.26", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.114.12", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.12", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.83", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.74", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.74", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.180.33", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.81", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.179.8", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.31.34", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.20.200.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.23.195.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.20", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.174.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.44.179.30", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.44.179.6", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.23.190.240", "255.255.255.0")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.23.190.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.184.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.72.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.46", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.48", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.0.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.204.108", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.204.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.48.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.36.113.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.210.5", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.142.120", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.46.55.12", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.33.121.4", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.160.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.141.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.185.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.112.4", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.25", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.31", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.29", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.76.2", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.76.254", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.202", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.192", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.232", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.16", "255.255.255.255")) { return "PROXY proxy7.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.37.0", "255.255.255.0")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.108.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.41.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.251.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.77.11", "255.255.255.255")) { return "PROXY proxy5-7.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.34.0", "255.255.255.0")) { return "PROXY proxy5-2.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.94.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.253.2", "255.255.255.255")) { return "PROXY proxy5-6.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.243", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.244", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.148", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.149", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.247", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.173", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.51", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.59", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.17", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.54", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.166", "255.255.255.255")) { return "PROXY proxy4.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.172", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.212.46", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.212.26", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.212.32", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.212.47", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.248.44", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.80.3", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.80.8", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.168.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.80.26", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.80.45", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.80.19", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.35.191.2", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.35.191.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.16.194.92", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.74.0", "255.255.255.0")) { return "PROXY proxy5-2.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.27.101.193", "255.255.255.255")) { return "PROXY proxy5-2.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.62.12", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.62.20", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.106.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.16.240", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.105.11", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.43", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.44", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.54", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.226.86", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.181.83", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.181.106", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.208.52", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.32", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.192", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.169", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.122", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.151.30", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.45.25.77", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.45.25.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.26.2", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.222.100", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.222.236", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.42.119", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.28", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.185", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.188", "255.255.255.255")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.208", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.9", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.90", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.94", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.248", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.151", "255.255.255.255")) { return "PROXY proxy5-8.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.214.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.75.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.222.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.12.26.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.17.18.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.164.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.144.5", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.144.246", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.144.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.130.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.16.112.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.157.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.121.0", "255.255.255.0")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.60.87.50", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.147", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.145", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.51", "255.255.255.255")) { return "PROXY proxy5-1.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.110", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.157", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.87", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.31.46", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.149", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.148", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.160", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.162", "255.255.255.255")) { return "PROXY proxy5-9.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "192.168.30.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.39.107.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "10.21.241.0", "255.255.255.0")) { return "PROXY proxy5.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.67.0", "255.255.255.0")) { return "PROXY proxy4-12.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.123.0", "255.255.255.0")) { return "PROXY proxy4-12.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.105.0", "255.255.255.0")) { return "PROXY proxy4-12.pc.mg.gov.br:3128"; }
    if (isInNet(myIpAddress(), "172.21.137.0", "255.255.255.0")) { return "PROXY proxy4-12.pc.mg.gov.br:3128"; }
    
    return "PROXY proxy.pc.mg.gov.br:3128";
}
